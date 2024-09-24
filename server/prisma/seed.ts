import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  // Create first user
  await prisma.user.create({
    data: {
      id: '3288fa32-1c78-42ed-b731-60b400531b24',
      name: 'Bob',
      email: 'bob@gmail.com',
      password: '12345678',
    },
  });

  // Create second user
  await prisma.user.create({
    data: {
      id: '7288fa32-1c78-42ed-b731-60b400531b24',
      name: 'Alice',
      email: 'alice@gmail.com',
      password: '12345678',
    },
  });

  // Create assistant user
  await prisma.user.create({
    data: {
      id: '8288fa32-1c78-42ed-b731-60b400531b24',
      name: 'Assistant',
      email: 'openai@gmail.com',
      isAssistant: true,
      password: '12345678',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
