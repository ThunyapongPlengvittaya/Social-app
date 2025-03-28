import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from '@/actions/profile.action';
import { notFound } from 'next/navigation';
import React from 'react';
import ProfilePageClient from './ProfilePageClient';

interface ProfilePageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
    // Resolve the `params` promise to access `username`
    const { username } = await params;

    if (!username) return {};

    const user = await getProfileByUsername(username);
    if (!user) return {};

    return {
        title: `${user.name ?? user.username}`,
        description: user.bio || `Check out ${user.username}'s profile`,
    };
}

export default async function ProfilePageServer({ params }: ProfilePageProps) {
    // Resolve the `params` promise to access `username`
    const { username } = await params;

    if (!username) {
        return notFound();
    }

    const user = await getProfileByUsername(username);
    if (!user) {
        return notFound();
    }

    const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
        getUserPosts(user.id),
        getUserLikedPosts(user.id),
        isFollowing(user.id),
    ]);

    return (
        <ProfilePageClient
            user={user}
            posts={posts}
            likedPosts={likedPosts}
            isFollowing={isCurrentUserFollowing}
        />
    );
}
