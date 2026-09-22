import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellPage } from './shell.page';

const routes: Routes = [
  {
    path: '',
    component: ShellPage,
    children: [
      { path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardPageModule) },
      { path: 'routines', loadChildren: () => import('../routines/routines.module').then((m) => m.RoutinesPageModule) },
      { path: 'exercises', loadChildren: () => import('../exercises/exercises.module').then((m) => m.ExercisesPageModule) },
      { path: 'workout', loadChildren: () => import('../workout/workout.module').then((m) => m.WorkoutPageModule) },
      { path: 'ai-coach', loadChildren: () => import('../ai-coach/ai-coach.module').then((m) => m.AiCoachPageModule) },
      { path: 'notes', loadChildren: () => import('../notes/notes.module').then((m) => m.NotesPageModule) },
      { path: 'calendar', loadChildren: () => import('../calendar/calendar.module').then((m) => m.CalendarPageModule) },
      { path: 'progress', loadChildren: () => import('../progress/progress.module').then((m) => m.ProgressPageModule) },
      { path: 'history', loadChildren: () => import('../history/history.module').then((m) => m.HistoryPageModule) },
      { path: 'goals', loadChildren: () => import('../goals/goals.module').then((m) => m.GoalsPageModule) },
      { path: 'profile', loadChildren: () => import('../profile/profile.module').then((m) => m.ProfilePageModule) },
      { path: 'feed', loadChildren: () => import('../feed/feed.module').then((m) => m.FeedPageModule) },
      {
        path: 'create-post',
        loadChildren: () => import('../create-post/create-post.module').then((m) => m.CreatePostPageModule),
      },
      {
        path: 'create-story',
        loadChildren: () => import('../create-story/create-story.module').then((m) => m.CreateStoryPageModule),
      },
      { path: 'posts/:id', loadChildren: () => import('../post-detail/post-detail.module').then((m) => m.PostDetailPageModule) },
      {
        path: 'stories/:userId',
        loadChildren: () => import('../story-viewer/story-viewer.module').then((m) => m.StoryViewerPageModule),
      },
      { path: 'notifications', loadChildren: () => import('../notifications/notifications.module').then((m) => m.NotificationsPageModule) },
      { path: 'messages', loadChildren: () => import('../messages/messages.module').then((m) => m.MessagesPageModule) },
      {
        path: 'messages/:id',
        loadChildren: () => import('../chat-conversation/chat-conversation.module').then((m) => m.ChatConversationPageModule),
      },
      { path: 'ranking', loadChildren: () => import('../ranking/ranking.module').then((m) => m.RankingPageModule) },
      { path: 'friends', loadChildren: () => import('../friends/friends.module').then((m) => m.FriendsPageModule) },
      {
        path: 'friends/:id',
        loadChildren: () => import('../friend-profile/friend-profile.module').then((m) => m.FriendProfilePageModule),
      },
      { path: 'achievements', loadChildren: () => import('../achievements/achievements.module').then((m) => m.AchievementsPageModule) },
      { path: 'challenges', loadChildren: () => import('../challenges/challenges.module').then((m) => m.ChallengesPageModule) },
      {
        path: 'group-workouts',
        loadChildren: () => import('../group-workouts/group-workouts.module').then((m) => m.GroupWorkoutsPageModule),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ShellPageRoutingModule {}
