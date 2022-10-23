const { Schema, model } = require("mongoose");

const GuildDapSchema = new Schema({
    userId: { type: String, required: true },
    userDap: { type: Number, required: true, default: 0 },
    dapsGiven: { type: Number, required: true, default: 0},
    dapsRecieved: { type: Number, required: true, default: 0},
    guildId: { type: String, required: true }
});


// dapchain is used for dap streaks and cooldown 
// dapchain is a ledger of transactions; doesnt show amount
const Dapchain = new Schema({
    giverId: { type: String, required: true },
    recieverId: { type: String, required: true },
    guildId: { type: String, required: true }
}, { timestamps: true });

exports.GuildDapSchema = model("GuildDap", GuildDapSchema);
exports.DapChain = model("Dapchain", Dapchain);