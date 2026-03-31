export default function OracleLoader() {
  return (
    <div className="oracle-loader">
      <div className="oracle-scene">
        <div className="oracle-aura" />
        <div className="oracle-globe">
          <div className="orbit orbit--1" />
          <div className="orbit orbit--2" />
          <div className="orbit orbit--3" />
          <div className="oracle-core" />
        </div>
      </div>
      <span className="oracle-text">
        Consulting the oracle
        <span className="oracle-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </span>
    </div>
  );
}
