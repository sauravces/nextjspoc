'use client'
interface ErrorProps {
    statusCode?: number;
    message?: string;
  }
  
  const ErrorComponent: React.FC<ErrorProps> = ({ message }) => {
    return (
      <div>
        <p>{message || 'Something went wrong.'}</p>
      </div>
    );
  };
  
  export default ErrorComponent;
  