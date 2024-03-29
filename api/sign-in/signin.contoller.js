const SignIn = require('./signin.model');

module.exports = {
  get: async (req, res) => {
    const { roomId } = req.params;

    try {
      const candidate = await SignIn.findOne({ id: roomId });

      if (!candidate) {
        return res.status(500).json({ message: 'Not Found' });
      }

      res.status(200).json({ data: candidate });
    } catch (e) {
      return res.status(500).json({
        error: e.message ? e.message : e,
        message: 'Internal Server Error'
      });
    }
  },

  create: async (req, res) => {
    const { id } = req.body;

    try {
      const candidate = await SignIn.findOne({ id });

      if (candidate) {
        return res.status(500).json({ message: 'Already Exist' });
      }

      await SignIn.create({ ...req.body });

      res.status(201).json({ message: 'Created' });
    } catch (e) {
      return res.status(500).json({
        error: e.message ? e.message : e,
        message: 'Internal Server Error'
      });
    }
  },

  update: async (req, res) => {
    const { roomId } = req.params;

    try {
      const candidate = await SignIn.findOne({ id: roomId });

      if (!candidate) {
        return res.status(500).json({ message: 'Not Found' });
      }

      await SignIn.updateOne({ id: roomId }, { ...req.body });

      res.status(200).json({ message: 'Updated' });
    } catch (e) {
      return res.status(500).json({
        error: e.message ? e.message : e,
        message: 'Internal Server Error'
      });
    }
  },

  delete: async (req, res) => {
    const { roomId } = req.params;

    try {
      const candidate = await SignIn.findOne({ id: roomId });

      if (!candidate) {
        return res.status(500).json({ message: 'Not Found' });
      }

      await SignIn.deleteOne({ id: roomId });

      res.status(200).json({ message: 'Deleted' });
    } catch (e) {
      return res.status(500).json({
        error: e.message ? e.message : e,
        message: 'Internal Server Error'
      });
    }
  },

  token: async (req, res) => res.status(200).json({ data: req.room })
}