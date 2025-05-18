
import { Friend, User } from '../types';

/**
 * Friend request test utilities
 * These functions can be used to test the friend request functionality
 */

/**
 * Checks if a friend request from one user to another exists
 */
export const testFriendRequestExists = (
  friends: Friend[],
  fromUserId: string,
  toUserId: string
): boolean => {
  const request = friends.find(friend => 
    friend.addedBy === fromUserId && 
    friend.toUserId === toUserId && 
    friend.status === 'pending'
  );
  
  console.log(`Request from ${fromUserId} to ${toUserId}: ${request ? 'EXISTS' : 'NOT FOUND'}`);
  
  return !!request;
};

/**
 * Checks if two users are friends
 */
export const testUsersAreFriends = (
  friends: Friend[],
  user1Id: string,
  user2Id: string
): boolean => {
  return friends.some(friend => 
    friend.status === 'accepted' && 
    ((friend.addedBy === user1Id && friend.toUserId === user2Id) ||
     (friend.addedBy === user2Id && friend.toUserId === user1Id))
  );
};

/**
 * Run basic tests on friend functionality 
 * Logs results to console
 */
export const runFriendTests = (
  friends: Friend[],
  currentUser: User | null,
  testUser: User
): void => {
  if (!currentUser) {
    console.error("TEST FAILED: No current user");
    return;
  }
  
  console.group("Friend System Tests");
  console.log("Current user:", currentUser);
  console.log("Target user:", testUser);
  console.log("All friend entries:", friends);
  
  // Test 1: Check directionality - requests should go FROM current user TO target
  const hasCorrectDirection = testFriendRequestExists(friends, currentUser.id, testUser.id);
  console.log(`Test 1 - Request has correct direction: ${hasCorrectDirection ? 'PASS' : 'FAIL'}`);
  
  // Test 2: Should NOT have wrong direction
  const hasWrongDirection = testFriendRequestExists(friends, testUser.id, currentUser.id);
  console.log(`Test 2 - No request in wrong direction: ${!hasWrongDirection ? 'PASS' : 'FAIL'}`);
  
  // Test 3: Check if users are friends
  const areFriends = testUsersAreFriends(friends, currentUser.id, testUser.id);
  console.log(`Test 3 - Users are friends: ${areFriends ? 'PASS' : 'Not friends yet (expected until acceptance)'}`);
  
  console.groupEnd();
};
