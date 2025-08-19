import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  AccountCircle,
  Refresh,
  Security
} from '@mui/icons-material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useToast } from './ToastNotifications';

const DRAWER_WIDTH = 280;

export default function DashboardLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { profileId: urlProfileId } = useParams();
  const { error: showError, success, info } = useToast();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [profile, setProfile] = useState(null);

  // Get profileId from URL params or localStorage
  const profileId = urlProfileId || localStorage.getItem('currentProfileId');

  // Load user profile data from localStorage
  useEffect(() => {
    const loadProfile = () => {
      try {
        // Try to get profile from persistent user profile storage
        const userProfile = localStorage.getItem('user_profile');
        if (userProfile) {
          const parsed = JSON.parse(userProfile);
          console.log('DashboardLayout: Loaded profile from user_profile:', parsed);
          setProfile(parsed);
          return;
        }
        
        // Fallback: try to get from onboarding data
        const onboardingData = localStorage.getItem('onboarding_progress');
        if (onboardingData) {
          const parsed = JSON.parse(onboardingData);
          if (parsed.profileData) {
            setProfile(parsed.profileData);
            return;
          }
        }
        
        // Fallback: try to get from currentProfileId
        if (profileId) {
          const profileData = localStorage.getItem(`profile_${profileId}`);
          if (profileData) {
            setProfile(JSON.parse(profileData));
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [profileId]);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: `/dashboard/${profileId || ''}` },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Trigger refresh of dashboard data
      window.location.reload();
      success('Dashboard refreshed successfully');
    } catch (error) {
      showError('Failed to refresh dashboard');
    } finally {
      setIsLoading(false);
      setLastRefresh(new Date());
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Brand Section */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Security color="primary" sx={{ fontSize: 28 }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          RiskIntel
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            onClick={() => {
              if (item.text === 'Dashboard' && profileId) {
                localStorage.setItem('currentProfileId', profileId);
              }
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 1,
              backgroundColor: location.pathname === item.path ? 'primary.light' : 'transparent',
              color: location.pathname === item.path ? 'primary.contrastText' : 'inherit',
              '&:hover': {
                backgroundColor: location.pathname === item.path ? 'primary.main' : 'action.hover',
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? 'inherit' : 'text.secondary',
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontSize: '0.875rem',
                fontWeight: location.pathname === item.path ? 600 : 400
              }}
            />
            {item.badge && (
              <Badge 
                badgeContent={item.badge} 
                color="error" 
                sx={{ ml: 'auto' }}
              />
            )}
          </ListItem>
        ))}
      </List>

      {/* User Profile Section */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
            <AccountCircle />
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {profile?.company ? profile.company : 'Company'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {location.pathname === '/dashboard' ? 'Risk Intelligence Dashboard' : 
               location.pathname === '/settings' ? 'Settings' : 'Dashboard'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={handleRefresh}
              disabled={isLoading}
              sx={{ 
                transform: isLoading ? 'rotate(360deg)' : 'none',
                transition: 'transform 1s linear'
              }}
            >
              <Refresh />
            </IconButton>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
              Last updated: {lastRefresh.toLocaleTimeString()}
            </Typography>
            <IconButton
              color="inherit"
              onClick={handleUserMenuOpen}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleUserMenuClose}>Account Settings</MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          localStorage.removeItem('currentProfileId');
          handleUserMenuClose();
          navigate('/onboarding');
        }}>Sign Out</MenuItem>
      </Menu>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              backgroundColor: 'background.paper'
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              backgroundColor: 'background.paper',
              borderRight: 1,
              borderColor: 'divider'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          backgroundColor: 'grey.50',
          minHeight: '100vh'
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ p: 3 }}>
          {React.cloneElement(children, { profileId })}
        </Box>
      </Box>
    </Box>
  );
} 