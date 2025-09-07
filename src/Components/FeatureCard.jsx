import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FeatureCard({ title, text, icon }) {
    return (
      <div className="bg-white shadow-md md:p-4 p-2 rounded-lg text-center w-full sm:w-1/3">
        <FontAwesomeIcon icon={icon} className="text-black-500 text-2xl md:mb-2 mb-1" />
        <h3 className="md:text-lg text-sm font-semibold">{title.toUpperCase()}</h3>
        <p className="md:text-sm md:block hidden text-xs md:mt-2 mt-1">{text.toUpperCase()}</p>
      </div>
    );
  }