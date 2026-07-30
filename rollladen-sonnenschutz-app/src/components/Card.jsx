export default function Card({ children, className = "" }) {
  return <section className={`rounded-[2rem] bg-white p-4 shadow-sm md:p-6 ${className}`}>{children}</section>;
}
