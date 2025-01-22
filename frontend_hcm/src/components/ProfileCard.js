const ProfileCard = ({ image, name, role }) => {
    return (
      <div className="flex items-center mr-10 rounded-lg">
        {/* Imagen */}
        <img
          src={image}
          alt={name}
          className="object-cover mr-10 rounded-sm h-44 w-36"
        />
        {/* Información */}
        <div>
          <h3 className="text-lg font-bold text-gray-800">{name}</h3>
          <p className="text-sm font-bold text-gray-600">{role}</p>
        </div>
      </div>
    );
  };
  
  export default ProfileCard;