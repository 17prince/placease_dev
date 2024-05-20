const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const catchAsync = require("../utils/catchAsync");
const Inbox = require("../models/inboxModel");

// OAuth2 credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

exports.checkTokenExist = catchAsync(async (req, res) => {
  // Fetch tokens if exist
  let tokenObj = await Inbox.findOne({ userId: req.user._id });

  const isTokenExist = tokenObj?.tokens ? true : false;

  tokenObj = undefined;

  res.status(200).json({
    status: "success",
    isTokenExist,
  });
});

exports.generateOAuthUrl = catchAsync(async (req, res) => {
  // Create OAuth2 client
  const oauth2Client = await createOAuth2Client(req.user._id);

  // Scopes for Gmail API
  const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

  // Generate URL for OAuth consent screen
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    include_granted_scopes: true,
  });
  res.redirect(authUrl);
});

exports.oauthCallback = catchAsync(async (req, res) => {
  // Create OAuth2 client
  const oauth2Client = await createOAuth2Client(req.user._id);
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code);

    await storeToken(req.user._id, tokens);

    return res.redirect("http://localhost:3000/inbox");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred, please try again !");
  }
});

async function storeToken(userId, tokens) {
  try {
    await Inbox.findOneAndUpdate(
      { userId: userId },
      { userId, tokens },
      { upsert: true }
    );
  } catch (error) {
    res.status(500).send("An error occurred while saving tokens ");
  }
}

async function createOAuth2Client(userId) {
  try {
    const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    const tokens = (await Inbox.findOne({ userId }))?.tokens;

    if (tokens?.refresh_token)
      oauth2Client.setCredentials({ refresh_token: tokens.refresh_token });

    // Set refresh token handler callback
    oauth2Client.on("tokens", async (tokens) => {
      console.log(tokens);
      if (tokens.refresh_token) {
        await storeToken(userId, tokens);
      }
    });

    return oauth2Client;
  } catch (error) {
    console.log("createOAuth2Client : ", error);
  }
}

exports.fetchEmails = catchAsync(async (req, res) => {
  try {
    // Create OAuth2 client with stored tokens
    const oauth2Client = await createOAuth2Client(req.user._id);

    // Fetch emails using Gmail API
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const response = await gmail.users.messages.list({
      userId: "me", // Use "me" to fetch emails for the authenticated user
      maxResults: 100,
    });

    const emails = response.data.messages;
    let emailObjects = await Promise.all(
      emails.map(async (email) => {
        const message = await gmail.users.messages.get({
          userId: "me",
          id: email.id,
        });
        // console.log(message);
        return {
          messageId: email.id,
          payload: message.data.payload,
          snippet: message.data.snippet,
        };
      })
    );

    emailObjects = emailObjects.map((ele) => {
      let email = ele.payload;
      return {
        messageId: ele.messageId,
        snippet: ele.snippet,
        headers: email.headers.filter((header) =>
          ["From", "Date", "To", "Subject"].includes(header.name)
        ),
        body:
          email.body.size > 0
            ? Buffer.from(email.body.data, "base64").toString("utf-8")
            : email.body,
        parts: email.parts,
      };
    });

    // emailObjects.forEach((email) => {
    //   console.log(email);
    // });

    res.status(200).json({ emails: emailObjects, size: emailObjects.length });
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).send("An error occurred while fetching emails.");
  }
});
