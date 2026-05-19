const Loader = ({ fullscreen = false, size = 'md' }) => {
  const sizes = { sm: '16px', md: '28px', lg: '44px' };
  const spinnerSize = sizes[size] || sizes.md;

  const spinner = (
    <div
      className="loader-spinner"
      style={{ width: spinnerSize, height: spinnerSize }}
      aria-label="Loading"
    />
  );

  if (fullscreen) {
    return (
      <div className="loader-fullscreen">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;
