import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FeatureCard({ title, text, icon }) {
    return (
      <div className="bg-white shadow-md p-4 rounded-lg text-center w-full sm:w-1/3">
        <FontAwesomeIcon icon={icon} className="text-black-500 text-2xl mb-2" />
        <h3 className="text-lg font-semibold">{title.toUpperCase()}</h3>
        <p className="text-sm mt-2">{text.toUpperCase()}</p>
      </div>
    );
  }