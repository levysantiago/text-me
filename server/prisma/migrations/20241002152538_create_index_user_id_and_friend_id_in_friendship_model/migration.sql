-- CreateIndex
CREATE INDEX "friendships_user_id_friend_id_idx" ON "friendships"("user_id", "friend_id");
