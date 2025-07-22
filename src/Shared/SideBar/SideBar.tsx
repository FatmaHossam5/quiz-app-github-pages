import { useState, useEffect } from "react";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "../../types";

export default function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { userData } = useSelector((state: RootState) => state.userData);
  const { role } = userData?.profile || {};
  const location = useLocation();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleToggle() {
    setIsCollapsed(!isCollapsed);
  }

  // Helper function to check if menu item is active
  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Menu items configuration
  const menuItems = [
    ...(role !== "Student" ? [
      {
        label: "Dashboard",
        icon: "fa-solid fa-chart-line",
        path: "/dashboard",
        key: "dashboard"
      },
      {
        label: "Groups",
        icon: "fa-solid fa-users",
        path: "/dashboard/groups",
        key: "groups"
      },
      {
        label: "Students",
        icon: "fa-solid fa-graduation-cap",
        path: "/dashboard/student",
        key: "students"
      },
      {
        label: "Questions",
        icon: "fa-solid fa-question-circle",
        path: "/dashboard/questions",
        key: "questions"
      }
    ] : []),
    {
      label: "Quizzes",
      icon: "fa-solid fa-clipboard-question",
      path: role === "Student" ? "/student" : "/dashboard/quizzes",
      key: "quizzes"
    },
    {
      label: "Results",
      icon: "fa-solid fa-chart-bar",
      path: role === "Student" ? "/student/results" : "/dashboard/results",
      key: "results"
    },
    {
      label: "Change Password",
      icon: "fa-solid fa-lock",
      path: "/change-password",
      key: "change-password"
    },
    {
      label: "Help",
      icon: "fa-solid fa-circle-question",
      path: "/help",
      key: "help"
    }
  ];

  return (
    <div className="h-screen relative">
      <Sidebar 
        className={`transition-all duration-300 ${
          isMobile ? 'absolute z-50 shadow-xl' : 'relative'
        }`}
        collapsed={isCollapsed}
        backgroundColor="#ffffff"
        rootStyles={{
          height: '100vh',
          border: '1px solid #e5e7eb',
          borderRadius: isMobile ? '0 8px 8px 0' : '0'
        }}
      >
        <Menu
          menuItemStyles={{
            button: ({ active, disabled }) => ({
              color: disabled ? '#9ca3af' : active ? '#8b5cf6' : '#374151',
              backgroundColor: active ? '#f3f4f6' : 'transparent',
              padding: '12px 16px',
              margin: '4px 8px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: active ? '600' : '400',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: active ? '#f3f4f6' : '#f9fafb',
                color: active ? '#8b5cf6' : '#1f2937',
                transform: 'translateX(2px)',
              },
              '&:active': {
                transform: 'translateX(0px)',
              }
            }),
            icon: ({ active }) => ({
              color: active ? '#8b5cf6' : '#6b7280',
              fontSize: '18px',
              marginRight: '12px'
            }),
            label: {
              fontWeight: 'inherit',
              fontSize: 'inherit'
            }
          }}
        >
          {/* Toggle Button */}
          <MenuItem
            onClick={handleToggle}
            icon={
              <i className={`fa-solid ${isCollapsed ? 'fa-bars' : 'fa-xmark'}`}></i>
            }
            className="mb-4 hover:bg-gray-50 transition-colors"
            style={{
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              margin: '0',
              borderRadius: '0'
            }}
          >
            {!isCollapsed && (
              <span className="font-medium text-gray-700">
                {isCollapsed ? 'Expand' : 'Collapse'} Menu
              </span>
            )}
          </MenuItem>

          {/* Menu Items */}
          {menuItems.map((item) => (
            <MenuItem
              key={item.key}
              icon={<i className={item.icon}></i>}
              component={<Link to={item.path} />}
              active={isActiveRoute(item.path)}
              title={isCollapsed ? item.label : undefined} // Tooltip for collapsed state
            >
              <span className="select-none">{item.label}</span>
            </MenuItem>
          ))}
        </Menu>

        {/* User Info Section (when expanded) */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user text-purple-600 text-sm"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userData?.profile?.role || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {role || 'Role'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Sidebar>

      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </div>
  );
}
