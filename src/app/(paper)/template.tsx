/*
 * the page dissolve: a soft entry on every navigation, like turning a
 * catalogue page. pure css, remounted per route — the room's walls and
 * navigation persist; only the contents dissolve. prefers-reduced-motion
 * collapses it to an instant appearance.
 */
export default function Dissolve({ children }: { children: React.ReactNode }) {
  return <div className="page-dissolve flex flex-1 flex-col">{children}</div>;
}
