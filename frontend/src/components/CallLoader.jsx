const CallLoader = ({ message = "Connecting..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-medium">{message}</h2>
      </div>
    </div>
  );
};

export default CallLoader;
