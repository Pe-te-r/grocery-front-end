import { useGetDriverDashboard } from "@/hooks/driverHook";
import { getUserIdHelper } from "@/lib/authHelper";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Truck,
  ClipboardList,
  CheckCircle,
  Clock,
  RefreshCw,
  Circle,
  Wifi
} from "lucide-react";

const statusVariants = {
  ONLINE: "bg-green-100 text-green-800",
  OFFLINE: "bg-gray-100 text-gray-800",
  BUSY: "bg-yellow-100 text-yellow-800",
};

const vehicleVariants = {
  TRUCK: "bg-emerald-100 text-emerald-800",
  VAN: "bg-teal-100 text-teal-800",
  CAR: "bg-cyan-100 text-cyan-800",
};

const DriverDashboard = () => {
    const id = getUserIdHelper() ?? ''
  const { data, isLoading, error } = useGetDriverDashboard(id);
  console.log('Driver Dashboard Data:', data);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error loading dashboard data
      </div>
    );
  }

  const driver = data?.data;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Driver Dashboard</h1>

        {/* Profile Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {driver?.name}
                  </h2>
                  <div className="flex items-center mt-1">
                    <Circle
                      className={`w-2 h-2 mr-1 ${
                        driver?.status === "ONLINE"
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                      fill={
                        driver?.status === "ONLINE" ? "#10B981" : "#6B7280"
                      }
                    />
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        statusVariants[driver?.status as keyof typeof statusVariants] ||
                        statusVariants.OFFLINE
                      }`}
                    >
                      {driver?.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{driver?.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{driver?.phone}</span>
                </div>
                <div className="flex items-center">
                  <Truck className="w-4 h-4 text-gray-500 mr-2" />
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      vehicleVariants[driver?.vehicle_type as keyof typeof vehicleVariants] ||
                      vehicleVariants.TRUCK
                    }`}
                  >
                    {driver?.vehicle_type}
                  </span>
                  <span className="text-sm text-gray-600 ml-2">
                    {driver?.license_plate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Assignments */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Assignments
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {driver?.total_assignments}
                </h3>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <ClipboardList className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(driver?.total_assignments / 10) * 100}%`,
                  }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full bg-green-500"
                ></motion.div>
              </div>
            </div>
          </motion.div>

          {/* Completed Assignments */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Completed
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {driver?.completed_assignments}
                </h3>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (driver?.completed_assignments / driver?.total_assignments) *
                      100
                    }%`,
                  }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full bg-emerald-500"
                ></motion.div>
              </div>
            </div>
          </motion.div>

          {/* Pending Assignments */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {driver?.pending_assignments}
                </h3>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (driver?.pending_assignments / driver?.total_assignments) *
                      100
                    }%`,
                  }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full bg-amber-500"
                ></motion.div>
              </div>
            </div>
          </motion.div>

          {/* In Progress Assignments */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {driver?.in_progress_assignments}
                </h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (driver?.in_progress_assignments / driver?.total_assignments) *
                      100
                    }%`,
                  }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full bg-blue-500"
                ></motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <Wifi className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Connection Status</h3>
                <p className="text-sm text-gray-500">
                  Last updated:{" "}
                  {new Date(driver?.updated_at || "").toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-2">
                <div className="flex items-center">
                  <Circle
                    className="w-2 h-2 mr-1 text-green-500"
                    fill="#10B981"
                  />
                  <span className="text-sm text-gray-600">
                    {driver?.status === "ONLINE" ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {driver?.status === "ONLINE"
                    ? "You're currently online"
                    : "You're currently offline"}
                </div>
              </div>
              <div className="relative">
                <div className="w-12 h-6 bg-gray-200 rounded-full">
                  <motion.div
                    className={`w-6 h-6 rounded-full absolute top-0 ${
                      driver?.status === "ONLINE"
                        ? "bg-green-500 right-0"
                        : "bg-gray-500 left-0"
                    }`}
                    initial={{
                      x: driver?.status === "ONLINE" ? 24 : 0,
                    }}
                    animate={{
                      x: driver?.status === "ONLINE" ? 24 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  ></motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              {
                id: 1,
                type: "Assignment",
                action: "Completed delivery #1234",
                time: "2 hours ago",
                icon: CheckCircle,
                color: "text-green-500",
              },
              {
                id: 2,
                type: "Assignment",
                action: "Started delivery #1235",
                time: "5 hours ago",
                icon: RefreshCw,
                color: "text-blue-500",
              },
              {
                id: 3,
                type: "System",
                action: "You came online",
                time: "6 hours ago",
                icon: Wifi,
                color: "text-green-500",
              },
              {
                id: 4,
                type: "Assignment",
                action: "Received new delivery #1235",
                time: "8 hours ago",
                icon: ClipboardList,
                color: "text-amber-500",
              },
            ].map((activity) => (
              <motion.div
                key={activity.id}
                whileHover={{ backgroundColor: "#f9fafb" }}
                className="px-6 py-4 flex items-start"
              >
                <div
                  className={`flex-shrink-0 p-2 rounded-lg ${activity.color.replace(
                    "text",
                    "bg"
                  )} bg-opacity-10 mr-4`}
                >
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">{activity.type}</p>
                </div>
                <div className="ml-4 text-sm text-gray-500 whitespace-nowrap">
                  {activity.time}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DriverDashboard;
