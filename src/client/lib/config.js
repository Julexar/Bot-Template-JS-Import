import 'dotenv/config';

export const config = {
  token: process.env.BOT_TOKEN,
  default_prefix: 'b!',
  owners: ['Your ID'],
  presence: {
    status: 'online',
    activity: [
      {
        name: 'Templates',
        type: 3,
      },
    ],
  },
};
