interface CertItem {
    cert: string;
    institution: string;
    year: string;
    link: string;
  }
  
  const certData: CertItem[] = [
    {
      cert: 'Genomic Data Analysis',
      institution: 'Johns Hopkins University',
      year: '2024',
      link: 'http://coursera.org/verify/specialization/S1FWZKZICVXU'
    }
  ];
  
  export const Certifications: React.FC = () => {
    return (
      <div>
        <h2>Certifications</h2>
        <ul>
          {certData.map((item, index) => (
            <li key={index}>
              <a href={item.link}><strong>{item.cert}</strong></a> - {item.institution} ({item.year})
            </li>
          ))}
        </ul>
      </div>
    );
  };