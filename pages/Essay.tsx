
import React from 'react';
import { 
  Quote, 
  Target, 
  MapPin, 
  GraduationCap, 
  Search, 
  BarChart3,
  Lightbulb
} from 'lucide-react';

const Essay: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Essay Header */}
      <div className="bg-lpdp-blue p-10 md:p-20 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-lpdp-gold/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10 text-center md:text-left">
          <span className="inline-block px-4 py-1 rounded-full bg-lpdp-gold text-lpdp-blue text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-lg">
            Impact Vision 2045
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tight">
            Data Sebagai Pilar Fundamental menuju Indonesia Emas 2045
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-6 text-blue-100">
            <div className="flex items-center space-x-2">
              <Quote size={20} className="text-lpdp-gold" />
              <p className="italic font-medium">"Data is the new oil." — Clive Humby</p>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HighlightCard 
          icon={Search} 
          title="The Core Problem" 
          text="Kesenjangan data regional dan rendahnya kualitas data di tingkat pedesaan menghambat kebijakan yang tepat sasaran."
          color="bg-red-50 text-red-700 border-red-100"
        />
        <HighlightCard 
          icon={Target} 
          title="Strategic Vision" 
          text="Transformasi data dari sekadar angka menjadi instrumen pengambil keputusan di Kecamatan Sidemen dan sekitarnya."
          color="bg-lpdp-gold/10 text-lpdp-blue border-lpdp-gold/20"
        />
        <HighlightCard 
          icon={BarChart3} 
          title="Future Impact" 
          text="Mencetak generasi literat data melalui jalur pendidikan tinggi dan pemberdayaan perangkat desa."
          color="bg-blue-50 text-lpdp-blue border-blue-100"
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Full Essay Text */}
        <div className="lg:col-span-8 space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="prose prose-slate max-w-none text-slate-700 leading-loose text-lg">
            <h2 className="text-2xl font-black text-lpdp-blue mb-6">Kontribusi diri untuk Indonesia</h2>
            
            <p>
              Dewasa ini, data memiliki peran penting dalam berbagai aspek. Data yang merupakan kumpulan fakta, angka, informasi atau rekaman yang diperoleh dari berbagai sumber memiliki peran dalam segala aspek kehidupan tak terkecuali dalam pembangunan suatu Negara. Data dalam konteks pembangunan suatu negara menjadi pondasi dalam mengidentifikasi masalah, merencanakan, mengukur kemajuan dan mengambil keputusan yang efektif.
            </p>

            <p>
              Sejak SMA saya melihat bahwa <strong>Kecamatan Sidemen</strong> memiliki permasalahan mendasar tentang data karena letak geografisnya yang jauh dari pusat kota Karangasem. Ketertarikan saya terhadap data membuat saya melanjutkan pendidikan di Universitas Udayana Program Studi Matematika dengan kompetensi Statistika.
            </p>

            <p>
              Hal yang menjadi titik mempererat pegangan untuk dapat berkontribusi dalam bidang data muncul saat saya sedang menjalankan kuliah kerja nyata di Desa Lokasari, Kecamatan Sidemen. Dari dialog dan observasi, permasalahan yang banyak dialami ialah ketidaktepatan pemberian bantuan pada masyarakat baik bantuan tunai, bedah rumah atau bantuan lainnya. Hal ini diperkuat dengan data di Desa yang belum termanajemen dan terintegrasi.
            </p>

            <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-lpdp-blue my-8 italic">
              "Tugas yang harus dilakukan adalah mengatasi permasalahan kesenjangan data dan kualitas data di Indonesia dengan mengembangkan strategi yang komprehensif."
            </div>

            <p>
              Melanjutkan studi ke program magister statistika dan sains data di <strong>Institut Pertanian Bogor</strong> merupakan langkah yang tepat. Setelah menyelesaikan pendidikan magister, saya berencana untuk berkontribusi dengan menjadi seorang dosen dan praktisi di bidang pendidikan tinggi. Saya ingin memaksimalkan ruang lingkup pendidikan, penelitian, dan pengabdian masyarakat untuk mengatasi permasalahan kesenjangan data dan kualitas data di Indonesia.
            </p>

            <p>
              Saya berharap dapat memberdayakan masyarakat dengan pengetahuan yang diperlukan untuk memanfaatkan potensi data dalam mengatasi permasalahan mereka. Dengan membentuk Lembaga Swadaya Masyarakat (LSM) yang berfokus pada edukasi data dan teknologi, saya akan memperkuat upaya kontribusi dan memastikan bahwa upaya tersebut mencapai daerah-daerah yang membutuhkan.
            </p>
          </div>
        </div>

        {/* Sidebar Milestones from Essay */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-lpdp-blue text-white p-8 rounded-[2rem] shadow-xl">
            <h3 className="text-xl font-black mb-6 flex items-center">
              <Lightbulb size={20} className="mr-3 text-lpdp-gold" />
              Key Pillars
            </h3>
            <ul className="space-y-6">
              <PillarItem 
                icon={MapPin} 
                title="Geographic Focus" 
                desc="Kecamatan Sidemen & Lokasari sebagai model percontohan desa literat data." 
              />
              <PillarItem 
                icon={GraduationCap} 
                title="Academic Goal" 
                desc="Mastering Statistical Analytics at IPB University." 
              />
              <PillarItem 
                icon={Users} 
                title="Social Empowerment" 
                desc="Edukasi perangkat desa untuk kebijakan berbasis data obyektif." 
              />
            </ul>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Strategic Road Map</h4>
             <div className="space-y-4">
                <TimelineStep active label="Education at IPB University" />
                <TimelineStep label="Academic & Practitioner Role" />
                <TimelineStep label="Data Empowerment LSM Founder" />
                <TimelineStep label="Indonesia Emas 2045 Realization" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HighlightCard = ({ icon: Icon, title, text, color }: any) => (
  <div className={`p-6 rounded-[2rem] border ${color} shadow-sm`}>
    <Icon size={24} className="mb-4" />
    <h3 className="font-black text-sm uppercase tracking-widest mb-2">{title}</h3>
    <p className="text-sm font-semibold leading-relaxed opacity-90">{text}</p>
  </div>
);

const PillarItem = ({ icon: Icon, title, desc }: any) => (
  <li className="flex space-x-4">
    <div className="p-2 bg-white/10 rounded-lg shrink-0 h-fit">
      <Icon size={18} className="text-lpdp-gold" />
    </div>
    <div>
      <h4 className="font-bold text-sm mb-1">{title}</h4>
      <p className="text-xs text-white/60 leading-relaxed">{desc}</p>
    </div>
  </li>
);

const TimelineStep = ({ label, active }: any) => (
  <div className="flex items-center space-x-3">
    <div className={`w-2 h-2 rounded-full ${active ? 'bg-lpdp-blue scale-125' : 'bg-slate-200'}`}></div>
    <span className={`text-xs font-bold ${active ? 'text-lpdp-blue' : 'text-slate-400'}`}>{label}</span>
  </div>
);

const Users = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export default Essay;
