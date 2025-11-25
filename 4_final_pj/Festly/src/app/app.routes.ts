import { Routes } from '@angular/router';
import { TabsComponent } from './components/tabs/tabs.component';
import { loginRedirectGuard } from './guards/login-redirect-guard';

/**
 * Global application routes
 *
 * This application uses a simple authentication + tabs layout structure:
 * - Unauthenticated users land on the login and register screens.
 * - Once authenticated, navigation happens inside the `TabsComponent` using child routes
 *   for the main sections (home feed, festivals map, new post and profile).
 *
 * The routing configuration is split so that:
 * - `/login` and `/register` are standalone pages.
 * - `/tabs` acts as a shell that hosts the main app via Ionic tabs.
 * - Child routes under `/tabs` are lazy-loaded to improve initial load time.
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
    canActivate: [loginRedirectGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.page').then(m => m.HomePage),
      },
      {
        path: 'festivals',
        loadComponent: () => import('./pages/festivals/festivals.page').then(m => m.FestivalsPage)
      },

      {
        path: 'new-post',
        loadComponent: () => import('./pages/new-post/new-post.page').then(m => m.NewPostPage)
      },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ]
  },
];
