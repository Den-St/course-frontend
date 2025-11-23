type ErrorProps = {
  message?: string;
};

const Error = ({ message = 'Something went wrong. Please try again.' }: ErrorProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-red-500">{message}</p>
    </div>
  );
};

export default Error;
