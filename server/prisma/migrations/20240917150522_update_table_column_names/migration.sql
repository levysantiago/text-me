/*
  Warnings:

  - You are about to drop the column `friendId` on the `friendships` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `friendships` table. All the data in the column will be lost.
  - You are about to drop the column `fromUserId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `toUserId` on the `messages` table. All the data in the column will be lost.
  - Added the required column `friend_id` to the `friendships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `friendships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_user_id` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_user_id` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "friendships" DROP COLUMN "friendId",
DROP COLUMN "userId",
ADD COLUMN     "friend_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "fromUserId",
DROP COLUMN "toUserId",
ADD COLUMN     "from_user_id" TEXT NOT NULL,
ADD COLUMN     "to_user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_assistant" BOOLEAN NOT NULL DEFAULT false;
