const { Schema, model } = require("mongoose");

const GuildDapSchema = new Schema({
    userId: { type: String, required: true },
    userDap: { type: Number, required: true, default: 0 },
    dapsGiven: { type: Number, required: true, default: 0},
    dapsRecieved: { type: Number, required: true, default: 0},
    guildId: { type: String, required: true }
}, { timestamps: true });


exports.GuildDapSchema = model("GuildDapSchema", GuildDapSchema);
