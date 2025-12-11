const NotificationService = require('../notifications/notification.service');
const UserRepository = require('../users/user.repository');

const issueService = require('./issue.service');

const createIssue = async (req, res, next) => {
  try {
    const { title, description, latitude, longitude } = req.body;
    const userId = req.user.id;

    // image_url might come from file upload middleware (req.file) or body
    let image_url = req.body.image_url;
    if (req.file) {
      // Assuming a static serve at /uploads
      image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    if (!title || !description || !latitude || !longitude) {
      res.status(400);
      throw new Error('Please provide title, description, latitude, and longitude');
    }

    const issue = await issueService.createIssue({
      user_id: req.user.id,
      title,
      description,
      image_url,
      latitude,
      longitude,
    });

    try {
      const admins = await UserRepository.findAdmins();

      // Loop through all admins and create a notification for each
      for (const admin of admins) {
        await NotificationService.createNotification(
            admin.id,          // The admin's User ID
            issue.id,       // The ID of the report
            `New Report: "${title}" by ${req.user.name}` // The message
        );
      }
    } catch (notifyErr) {
      // Log error but don't fail the request if notifications fail
      console.error('Failed to send admin notifications:', notifyErr);
    }

    res.status(201).json(issue);
  } catch (err) {
    next(err);
  }
};

const getIssues = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const issues = await issueService.getIssues(page, limit, status);
    res.json(issues);
  } catch (error) {
    next(error);
  }
};

const getIssueById = async (req, res, next) => {
  try {
    const issue = await issueService.getIssueById(req.params.id);
    res.json(issue);
  } catch (error) {
    if (error.message === 'Issue not found') {
      res.status(404);
    }
    next(error);
  }
};

const getUserIssues = async (req, res, next) => {
    try {
        const issues = await issueService.getUserIssues(req.user.id);
        res.json(issues);
    } catch (error) {
        next(error);
    }
}

module.exports = { createIssue, getIssues, getIssueById, getUserIssues };
