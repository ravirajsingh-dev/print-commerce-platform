const mongoose = require("mongoose");

const bitsForUpgradeSchema = new mongoose.Schema({
  bits_type: {
    type: String,
    enum: ["Passive", "Direct", "Upgrade"],
  },
  link_type: {
    type: Number,
  },
  bits: {
    type: Number,
  },
});

const earningsForUpgradeSchema = new mongoose.Schema({
  total_earnings: {
    type: Number,
  },
  deals_count: {
    type: Number,
  },
  deal_bits: {
    type: Number,
  },
  bits_type: {
    type: String,
  },
  link_type: {
    type: Number,
  },
});

const LevelSchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      required: true,
      default: 0,
    },
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    required_H2C_bits: {
      type: Number,
    },
    upgrade_bits: {
      type: Number,
    },
    bits_for_upgrade: {
      type: [bitsForUpgradeSchema],
    },
    earnings_on_upgrade: {
      type: earningsForUpgradeSchema,
    },
  },
  {
    timestamps: true,
  }
);

const Level = mongoose.model("config_levels", LevelSchema);

const getLevel = (level) => {
  try {
    const levelData = Level.findOne({ level });

    if (!levelData) {
      return null;
    }

    return levelData;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getLevels = () => {
  try {
    const levels = Level.find();

    if (!levels) {
      return [];
    }

    return levels;
  } catch (err) {
    console.log(err);
    return [];
  }
};

module.exports = {
  Level,
  getLevel,
  getLevels,
};
