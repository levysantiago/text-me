-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_friendships" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_friendships" ("created_at", "friendId", "id", "updated_at", "userId") SELECT "created_at", "friendId", "id", "updated_at", "userId" FROM "friendships";
DROP TABLE "friendships";
ALTER TABLE "new_friendships" RENAME TO "friendships";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
