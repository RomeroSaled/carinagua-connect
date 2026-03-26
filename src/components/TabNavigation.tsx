interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "info", label: "Información General" },
  { id: "residente", label: "Residente" },
  { id: "representante", label: "Representante" },
];

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <nav className="flex flex-wrap border-b border-border bg-card">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`tab-button ${activeTab === tab.id ? "tab-button-active" : ""}`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default TabNavigation;
