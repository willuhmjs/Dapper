const { Schema, model } = require("mongoose");

const DapSchema = new Schema({
    giverId: { type: String, required: true },
    recieverId: { type: String, required: true },
    giverDap: { type: Number, required: true },
    recieverDap: { type: Number, required: true },
    guildId: { type: String, required: true }
}, { timestamps: true });

exports.DapSchema = model("DapSchema", DapSchema);