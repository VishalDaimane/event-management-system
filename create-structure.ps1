# Root folder
$root = "event-management-system"
New-Item -ItemType Directory -Path $root

# Recursive function to create structure
function New-Structure {
    param (
        [string]$base,
        [string[]]$items
    )
    foreach ($item in $items) {
        $path = Join-Path $base $item
        if ($item -like "*.*") {
            # It's a file
            New-Item -ItemType File -Path $path -Force | Out-Null
        } else {
            # It's a folder
            New-Item -ItemType Directory -Path $path -Force | Out-Null
        }
    }
}

# Backend
New-Structure "$root\backend" @(
    "config\database.js","config\cloudinary.js",
    "controllers\authController.js","controllers\eventController.js","controllers\bookingController.js","controllers\userController.js",
    "middleware\auth.js","middleware\upload.js","middleware\errorHandler.js",
    "models\User.js","models\Event.js","models\Booking.js",
    "routes\auth.js","routes\events.js","routes\bookings.js","routes\users.js",
    "utils\emailService.js","utils\generateToken.js",
    ".env","server.js","package.json"
)

# Frontend
New-Structure "$root\frontend" @(
    "public\index.html","public\favicon.ico",
    "src\components\common\Navbar.jsx","src\components\common\Footer.jsx","src\components\common\Sidebar.jsx","src\components\common\LoadingSpinner.jsx","src\components\common\ProtectedRoute.jsx",
    "src\components\events\EventCard.jsx","src\components\events\EventDetail.jsx","src\components\events\EventForm.jsx","src\components\events\EventList.jsx","src\components\events\SearchFilters.jsx",
    "src\components\dashboard\AdminDashboard.jsx","src\components\dashboard\UserDashboard.jsx","src\components\dashboard\StatsCard.jsx","src\components\dashboard\EventsTable.jsx","src\components\dashboard\Chart.jsx",
    "src\components\auth\Login.jsx","src\components\auth\Register.jsx","src\components\auth\Profile.jsx",
    "src\pages\Home.jsx","src\pages\Events.jsx","src\pages\EventDetails.jsx","src\pages\CreateEvent.jsx","src\pages\Dashboard.jsx","src\pages\NotFound.jsx",
    "src\hooks\useAuth.js","src\hooks\useLocalStorage.js",
    "src\context\AuthContext.js","src\context\ThemeContext.js",
    "src\services\api.js","src\services\authService.js","src\services\eventService.js","src\services\bookingService.js",
    "src\utils\constants.js","src\utils\helpers.js",
    "src\App.jsx","src\index.js","src\index.css",
    "package.json","tailwind.config.js"
)

# Root-level files
New-Structure $root @("docker-compose.yml","Dockerfile","README.md")
