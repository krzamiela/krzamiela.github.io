interface VolunteerItem {
    title: string;
    institution: string;
    year: string
  }
  
  const volunteerData: VolunteerItem[] = [
    {
      title: 'Lab Volunteer (Dr. Ece Mutlu\'s lab)',
      institution: 'University of Illinois - Chicago',
      year: '2024 - Current'
    },
    {
        title: 'VP for Communications',
        institution: 'Association for Women in Science - Chicago chapter',
        year: '2024 - Current'
    },
  ];
  
  export const Volunteering: React.FC = () => {
    return (
      <div>
        <h2>Volunteering</h2>
        <ul>
          {volunteerData.map((item, index) => (
                <li key={index}>
                <strong>{item.title}</strong> - {item.institution} ({item.year})
                </li>
          ))}
        </ul>
      </div>
    );
  };