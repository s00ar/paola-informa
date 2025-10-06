# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
## Cloud Functions & Webhooks

This project now includes Firebase Cloud Functions (see `functions/index.js`) that listen for changes in the `news` collection. When a document is created, updated, or deleted, the function:

1. Posts a JSON payload to a configurable webhook (`WEBHOOK_URL` or `functions.config().webhook.news_url`).
2. Broadcasts an FCM notification to the `news` topic so the app can update instantly.

### Setup steps

1. Install function dependencies:
   ```bash
   cd functions
   npm install
   ```
2. Configure the webhook endpoint (replace the URL with your endpoint):
   ```bash
   firebase functions:config:set webhook.news_url="https://your-server.com/firestore-hook"
   ```
3. (Optional) Instead of Functions config, you can set an environment variable when deploying:
   ```bash
   WEBHOOK_URL="https://your-server.com/firestore-hook" firebase deploy --only functions
   ```
4. Deploy the Cloud Function:
   ```bash
   firebase deploy --only functions
   ```
5. Make sure your mobile clients subscribe to the `news` topic using FCM or Expo Notifications so they receive the push alerts emitted by the function.

> Tip: If your webhook expects authentication, extend `postToWebhook` in `functions/index.js` to add the required headers or signatures before deployment.
