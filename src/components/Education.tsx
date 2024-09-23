interface EducationItem {
    degree: string;
    institution: string;
    year: string;
  }
  
  const educationData: EducationItem[] = [
    {
      degree: 'Premedicine Post-Baccalaureate Certificate ',
      institution: 'Northwestern University School of Professional Studies',
      year: 'est. 2026',
    },
    {
      degree: 'Master of Library and Information Science',
      institution: 'University of Illinois Urbana-Champaign',
      year: '2020',
    },
    {
      degree: 'Bachelor of Science, Computer Science and Anthropology',
      institution: 'Oregon State University',
      year: '2016'
    }
  ];
  
  export const Education: React.FC = () => {
    return (
      <div>
        <h2>Education</h2>
        <ul>
          {educationData.map((item, index) => (
            <li key={index}>
              <strong>{item.degree}</strong> - {item.institution} ({item.year})
            </li>
          ))}
        </ul>
      </div>
    );
  };