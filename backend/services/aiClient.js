const axios = require("axios");

module.exports.getSkillPrediction = async ({ test_score, project_score }) => {
  try {
    const res = await axios.post("http://127.0.0.1:5002/predict", {
      test_score,
      project_score
    });

    return res.data;
  } catch (err) {
    console.error("AI Client Error:", err.response?.data || err.message);
    return { predicted_skill: "Unknown" };
  }
};
