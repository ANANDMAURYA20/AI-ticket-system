import { inngest } from "../client.js";
import Ticket from "../../models/ticket.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/ai.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;

      // Fetch ticket from DB
      const ticketDoc = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticketObject) {
          throw new NonRetriableError("Ticket not found");
        }
        return ticketObject;
      });

      // Update initial status
      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticketDoc._id, { status: "TODO" });
      });

      // Run AI analysis
      const aiResponse = await analyzeTicket(ticketDoc);

      const relatedSkills = await step.run("ai-processing", async () => {
        let skills = [];
        if (aiResponse) {
          await Ticket.findByIdAndUpdate(ticketDoc._id, {
            priority: !["low", "medium", "high"].includes(aiResponse.priority)
              ? "medium"
              : aiResponse.priority,
            helpfulNotes: aiResponse.helpfulNotes,
            status: "IN_PROGRESS",
            relatedSkills: aiResponse.relatedSkills,
          });
          skills = aiResponse.relatedSkills;
        }
        return skills;
      });

      // Assign moderator
      const moderator = await step.run("assign-moderator", async () => {
        let user = await User.findOne({
          role: "moderator",
          skills: {
            $elemMatch: {
              $regex: relatedSkills.join("|"),
              $options: "i",
            },
          },
        });

        if (!user) {
          user = await User.findOne({ role: "admin" });
        }

        await Ticket.findByIdAndUpdate(ticketDoc._id, {
          assignedTo: user?._id || null,
        });

        return user;
      });

      // Send email notification
      await step.run("send-email-notification", async () => {
        if (moderator) {
          const finalTicket = await Ticket.findById(ticketDoc._id);
          await sendMail(
            moderator.email,
            "Ticket Assigned",
            `A new ticket has been assigned to you: ${finalTicket.title}`
          );
        }
      });

      return { success: true };
    } catch (err) {
      console.error("❌ Error running the step:", err.message);
      return { success: false, error: err.message };
    }
  }
);
