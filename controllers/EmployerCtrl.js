import Employer from "../models/Employer.js";

const EmployerCtrl = {
  createEmployer: async (req, res) => {
    try {
      const { name, city, state, company } = req.body;
      const avatarUrl = req.file ? req.file.location : null;
      const filesUrls = req.files ? req.files.map((f) => f.location) : [];

      const employer = new Employer({
        name,
        city,
        state,
        company,
        avatar: avatarUrl,
        files: filesUrls,
      });

      await employer.save();
      res.status(201).json({ status: "success", employer });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },
};

export default EmployerCtrl;
