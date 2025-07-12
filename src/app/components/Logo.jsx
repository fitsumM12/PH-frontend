export default function Logo({ className }) {
  return (
    <img src={process.env.PUBLIC_URL+"/assets/images/EAII.png"} style={{ width: 50, height: 50, borderRadius: 20 }} alt="EAII"/>
  );
}
