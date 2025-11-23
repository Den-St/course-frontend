type LoaderProps = {
  message?: string;
};

const Loader = ({ message = 'Loading...' }: LoaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default Loader;
