import React, { 
    useState, 
    useEffect, 
    useRef 
} from "react";
import { 
    getMovieGenres, 
    getCountries 
} from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { 
    IoMdMoon, 
    IoMdSunny, 
    IoMdSearch 
} from "react-icons/io";
import { FaRobot } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function NavBar({ 
    onSearch, 
    onGenreFilter, 
    onYearFilter, 
    onCountryFilter, 
    onReset, 
    activeGenre, 
    activeYear, 
    activeCountry 
}) {
    const { 
        theme, 
        toggleTheme 
    } = useTheme();
    
    const navigate = useNavigate();
    
    const { 
        t, 
        i18n 
    } = useTranslation();

    const [searchQuery, setSearchQuery] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

    const [isMobileGenreOpen, setIsMobileGenreOpen] = useState(false);
    const [isMobileYearOpen, setIsMobileYearOpen] = useState(false);
    const [isMobileCountryOpen, setIsMobileCountryOpen] = useState(false);

    const [countries, setCountries] = useState([]);
    const [genres, setGenres] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    const [genreSearch, setGenreSearch] = useState("");
    const [yearSearch, setYearSearch] = useState("");
    const [countrySearch, setCountrySearch] = useState("");

    const dropdownRef = useRef(null);

    const currentYear = new Date().getFullYear();
    
    const years = Array.from(
        { length: 50 }, 
        (_, i) => currentYear + 1 - i
    );

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'id' : 'en';
        i18n.changeLanguage(newLang);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target)
            ) {
                setIsGenreDropdownOpen(false);
                setIsYearDropdownOpen(false);
                setIsCountryDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!isGenreDropdownOpen) setGenreSearch("");
        if (!isYearDropdownOpen) setYearSearch("");
        if (!isCountryDropdownOpen) setCountrySearch("");
    }, [isGenreDropdownOpen, isYearDropdownOpen, isCountryDropdownOpen]);

    useEffect(() => {
        setSelectedGenre(activeGenre);
        setSelectedYear(activeYear);
        setSelectedCountry(activeCountry);
    }, [activeGenre, activeYear, activeCountry]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [genreList, countryList] = await Promise.all([
                    getMovieGenres(),
                    Promise.resolve(getCountries())
                ]);
                setGenres(genreList);
                setCountries(countryList);
            } catch (error) {
                console.error(error);
            }
        };
        loadData();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
        setIsMenuOpen(false);
    };

    const handleLogoClick = (e) => {
        e.preventDefault();
        sessionStorage.clear();
        setSelectedGenre(null);
        setSelectedYear(null);
        setSelectedCountry(null);
        setIsMenuOpen(false);
        if (onReset) {
            onReset();
            window.scrollTo({ 
                top: 0, 
                behavior: "smooth" 
            });
        } else {
            window.location.href = "/";
        }
    };

    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre);
        setIsGenreDropdownOpen(false);
        setIsMobileGenreOpen(false);
        setIsMenuOpen(false);
        onGenreFilter(genre);
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        setIsYearDropdownOpen(false);
        setIsMobileYearOpen(false);
        setIsMenuOpen(false);
        onYearFilter(year);
    };

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setIsCountryDropdownOpen(false);
        setIsMobileCountryOpen(false);
        setIsMenuOpen(false);
        onCountryFilter(country);
    };

    const clearFiltersAndNotify = () => {
        if (onReset) onReset();
        setIsGenreDropdownOpen(false);
        setIsYearDropdownOpen(false);
        setIsCountryDropdownOpen(false);
        setIsMobileGenreOpen(false);
        setIsMobileYearOpen(false);
        setIsMobileCountryOpen(false);
    };

    const filteredGenres = genres.filter(g => 
        g.name.toLowerCase().includes(genreSearch.toLowerCase())
    );
    
    const filteredYears = years.filter(y => 
        y.toString().includes(yearSearch)
    );
    
    const filteredCountries = countries.filter(c => 
        c.english_name.toLowerCase().includes(countrySearch.toLowerCase())
    );

    return (
        <nav 
            className={`
                sticky top-0 z-50 transition-all duration-500
                ${isScrolled 
                    ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-lg' 
                    : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-transparent dark:border-gray-800/30'
                }
            `}
        >
            <div 
                className="w-[92%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
            >
                <div 
                    className={`
                        flex items-center justify-between transition-all duration-500 
                        ${isScrolled ? 'h-16' : 'h-20'}
                    `}
                >
                    <div className="flex-shrink-0">
                        <button 
                            onClick={handleLogoClick} 
                            className="group relative no-underline bg-transparent border-none cursor-pointer text-left p-0"
                        >
                            <span 
                                className="relative text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight"
                            >
                                CINEMA
                                <span 
                                    className="ml-1 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
                                >
                                    VIN
                                </span>
                            </span>
                        </button>
                    </div>

                    <div 
                        className="hidden lg:flex items-center space-x-3" 
                        ref={dropdownRef}
                    >
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsGenreDropdownOpen(!isGenreDropdownOpen);
                                    setIsYearDropdownOpen(false);
                                    setIsCountryDropdownOpen(false);
                                }}
                                className={`
                                    relative font-medium text-base transition-all duration-300 no-underline group px-3 py-2 rounded-lg border 
                                    ${isGenreDropdownOpen 
                                        ? 'text-gray-900 bg-white border-gray-200 shadow-sm' 
                                        : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white border-transparent'
                                    }
                                `}
                            >
                                <span className="flex items-center">
                                    {t('navbar.genre')}
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor" 
                                        className={`
                                            ml-1 h-4 w-4 transition-transform 
                                            ${isGenreDropdownOpen ? 'rotate-180' : ''}
                                        `}
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M19 9l-7 7-7-7" 
                                        />
                                    </svg>
                                </span>
                                {selectedGenre && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span 
                                            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
                                        ></span>
                                        <span 
                                            className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"
                                        ></span>
                                    </span>
                                )}
                            </button>
                            
                            {isGenreDropdownOpen && (
                                <div 
                                    className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl animate-in slide-in-from-top-2 duration-200 overflow-hidden z-50"
                                >
                                    <div 
                                        className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                                    >
                                        <div 
                                            className="sticky top-0 bg-white dark:bg-gray-800 pb-2 mb-2 border-b border-gray-100 dark:border-gray-700 z-10 space-y-2"
                                        >
                                            <button
                                                onClick={clearFiltersAndNotify}
                                                className="text-xs font-bold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors w-full text-left px-2 uppercase tracking-wider"
                                            >
                                                {t('navbar.clear_filters')}
                                            </button>
                                            <div className="relative px-2">
                                                <input 
                                                    type="text" 
                                                    placeholder={t('navbar.genre_search')}
                                                    value={genreSearch}
                                                    onChange={(e) => setGenreSearch(e.target.value)}
                                                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 dark:text-gray-200 placeholder-gray-400"
                                                />
                                                <IoMdSearch 
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                                                />
                                            </div>
                                        </div>
                                        
                                        {filteredGenres.length > 0 ? (
                                            filteredGenres.map((genre) => (
                                                <button
                                                    key={genre.id}
                                                    onClick={() => handleGenreSelect(genre)}
                                                    className={`
                                                        w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 text-sm mb-1
                                                        ${selectedGenre?.id === genre.id 
                                                            ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold' 
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white'
                                                        }
                                                    `}
                                                >
                                                    {genre.name}
                                                </button>
                                            ))
                                        ) : (
                                            <div 
                                                className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                                            >
                                                Genre {t('navbar.not_found')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsYearDropdownOpen(!isYearDropdownOpen);
                                    setIsGenreDropdownOpen(false);
                                    setIsCountryDropdownOpen(false);
                                }}
                                className={`
                                    relative font-medium text-base transition-all duration-300 no-underline group px-3 py-2 rounded-lg border
                                    ${isYearDropdownOpen 
                                        ? 'text-gray-900 bg-white border-gray-200 shadow-sm' 
                                        : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white border-transparent'
                                    }
                                `}
                            >
                                <span className="flex items-center">
                                    {t('navbar.year')}
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor" 
                                        className={`
                                            ml-1 h-4 w-4 transition-transform 
                                            ${isYearDropdownOpen ? 'rotate-180' : ''}
                                        `}
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M19 9l-7 7-7-7" 
                                        />
                                    </svg>
                                </span>
                                {selectedYear && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span 
                                            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"
                                        ></span>
                                        <span 
                                            className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"
                                        ></span>
                                    </span>
                                )}
                            </button>
                            
                            {isYearDropdownOpen && (
                                <div 
                                    className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl animate-in slide-in-from-top-2 duration-200 overflow-hidden z-50"
                                >
                                    <div 
                                        className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                                    >
                                        <div 
                                            className="sticky top-0 bg-white dark:bg-gray-800 pb-2 mb-2 border-b border-gray-100 dark:border-gray-700 z-10 space-y-2"
                                        >
                                            <button
                                                onClick={clearFiltersAndNotify}
                                                className="text-xs font-bold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors w-full text-left px-2 uppercase tracking-wider"
                                            >
                                                {t('navbar.clear')}
                                            </button>
                                            <div className="relative px-2">
                                                <input 
                                                    type="number" 
                                                    placeholder={t('navbar.year_search')}
                                                    value={yearSearch}
                                                    onChange={(e) => setYearSearch(e.target.value)}
                                                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-md focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-gray-700 dark:text-gray-200 placeholder-gray-400 appearance-none"
                                                />
                                                <IoMdSearch 
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                                                />
                                            </div>
                                        </div>

                                        {filteredYears.length > 0 ? (
                                            filteredYears.map((year) => (
                                                <button
                                                    key={year}
                                                    onClick={() => handleYearSelect(year)}
                                                    className={`
                                                        w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm mb-1
                                                        ${selectedYear === year 
                                                            ? 'bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold' 
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white'
                                                        }
                                                    `}
                                                >
                                                    {year}
                                                </button>
                                            ))
                                        ) : (
                                            <div 
                                                className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                                            >
                                                {t('navbar.year')} {t('navbar.not_found')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsCountryDropdownOpen(!isCountryDropdownOpen);
                                    setIsGenreDropdownOpen(false);
                                    setIsYearDropdownOpen(false);
                                }}
                                className={`
                                    relative font-medium text-base transition-all duration-300 no-underline group px-3 py-2 rounded-lg border
                                    ${isCountryDropdownOpen 
                                        ? 'text-gray-900 bg-white border-gray-200 shadow-sm' 
                                        : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white border-transparent'
                                    }
                                `}
                            >
                                <span className="flex items-center">
                                    {t('navbar.country')}
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor" 
                                        className={`
                                            ml-1 h-4 w-4 transition-transform 
                                            ${isCountryDropdownOpen ? 'rotate-180' : ''}
                                        `}
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M19 9l-7 7-7-7" 
                                        />
                                    </svg>
                                </span>
                                {selectedCountry && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span 
                                            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                                        ></span>
                                        <span 
                                            className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"
                                        ></span>
                                    </span>
                                )}
                            </button>
                            
                            {isCountryDropdownOpen && (
                                <div 
                                    className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl animate-in slide-in-from-top-2 duration-200 overflow-hidden z-50"
                                >
                                    <div 
                                        className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                                    >
                                        <div 
                                            className="sticky top-0 bg-white dark:bg-gray-800 pb-2 mb-2 border-b border-gray-100 dark:border-gray-700 z-10 space-y-2"
                                        >
                                            <button
                                                onClick={clearFiltersAndNotify}
                                                className="text-xs font-bold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors w-full text-left px-2 uppercase tracking-wider"
                                            >
                                                {t('navbar.clear')}
                                            </button>
                                            <div className="relative px-2">
                                                <input 
                                                    type="text" 
                                                    placeholder={t('navbar.country_search')}
                                                    value={countrySearch}
                                                    onChange={(e) => setCountrySearch(e.target.value)}
                                                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-md focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-700 dark:text-gray-200 placeholder-gray-400"
                                                />
                                                <IoMdSearch 
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                                                />
                                            </div>
                                        </div>
                                        
                                        {filteredCountries.length > 0 ? (
                                            filteredCountries.map((country) => (
                                                <button
                                                    key={country.iso_3166_1}
                                                    onClick={() => handleCountrySelect(country)}
                                                    className={`
                                                        w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm mb-1 truncate
                                                        ${selectedCountry?.iso_3166_1 === country.iso_3166_1 
                                                            ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold' 
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white'
                                                        }
                                                    `}
                                                >
                                                    {country.english_name}
                                                </button>
                                            ))
                                        ) : (
                                            <div 
                                                className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                                            >
                                                {t('navbar.country')} {t('navbar.not_found')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {[
                            { name: t('navbar.now_playing'), href: "#now_playing" },
                            { name: t('navbar.popular'), href: "#popular" },
                            { name: t('navbar.top_rated'), href: "#top_rated" }
                        ].map((item, index) => (
                            <a 
                                key={index}
                                href={item.href} 
                                className="relative text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium text-xs transition-all duration-300 hover:scale-105 no-underline px-3 py-2"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center space-x-3">
                        <form 
                            onSubmit={handleSearchSubmit} 
                            className="relative"
                        >
                            <div 
                                className={`
                                    flex items-center transition-all duration-500 transform 
                                    ${isSearchFocused ? 'scale-105' : ''}
                                `}
                            >
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        placeholder={t('navbar.search_placeholder')}
                                        className={`
                                            relative w-48 lg:w-64 px-4 py-2 pr-10 rounded-full text-sm transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border
                                            ${isSearchFocused 
                                                ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20' 
                                                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                                            }
                                        `}
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        <IoMdSearch className="h-4 w-4"/>
                                    </button>
                                </div>
                            </div>
                        </form>

                        <button
                            onClick={toggleLanguage}
                            className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-transparent dark:border-gray-700 text-sm font-bold w-10 h-10 flex items-center justify-center text-gray-800 dark:text-gray-200"
                            aria-label="Change Language"
                        >
                            {i18n.language === 'id' ? '🇮🇩' : '🇺🇸'}
                        </button>

                        <button
                            onClick={() => navigate('/ai-chat')}
                            className="p-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 border-0 shadow-lg hover:shadow-xl transform hover:scale-105"
                            aria-label="AI Chat"
                        >
                            <FaRobot className="w-5 h-5" />
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-transparent dark:border-gray-700"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' 
                                ? <IoMdSunny className="w-5 h-5 text-yellow-500" /> 
                                : <IoMdMoon className="w-5 h-5" />
                            }
                        </button>
                    </div>

                    <div className="flex lg:hidden items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:bg-gray-800 rounded-full transition-colors focus:outline-none"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor" 
                                className="h-7 w-7"
                            >
                                {isMenuOpen ? (
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M6 18L18 6M6 6l12 12" 
                                    />
                                ) : (
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M4 6h16M4 12h16M4 18h16" 
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div 
                    className={`
                        lg:hidden absolute top-full left-0 w-full h-[calc(100vh-64px)] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2 duration-300
                        ${theme === 'dark' ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-100'}
                    `}
                >
                    <div className="flex flex-col px-5 py-6 pb-32 space-y-6">
                        
                        <form 
                            onSubmit={handleSearchSubmit} 
                            className="relative w-full"
                        >
                            <IoMdSearch 
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 h-6 w-6" 
                            />
                            <input 
                                type="text" 
                                placeholder={t('navbar.search_placeholder')} 
                                value={searchQuery} 
                                onChange={handleSearchChange} 
                                className="w-full pl-14 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-base shadow-inner placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </form>

                        <div className="flex flex-wrap gap-3">
                            {[
                                { name: t('navbar.now_playing'), href: "#now_playing", color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800 border-blue-100 dark:border-gray-700" },
                                { name: t('navbar.popular'), href: "#popular", color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-gray-800 border-purple-100 dark:border-gray-700" },
                                { name: t('navbar.top_rated'), href: "#top_rated", color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-gray-800 border-orange-100 dark:border-gray-700" }
                            ].map((item, index) => (
                                <a 
                                    key={index}
                                    href={item.href} 
                                    onClick={() => setIsMenuOpen(false)} 
                                    className={`
                                        no-underline px-4 py-2 rounded-full font-bold text-base border transition-transform active:scale-95
                                        ${item.color}
                                    `}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                                <button 
                                    onClick={() => setIsMobileGenreOpen(!isMobileGenreOpen)} 
                                    className="w-full flex justify-between items-center px-4 py-3 text-gray-800 dark:text-white font-bold text-lg focus:outline-none"
                                >
                                    {t('navbar.genre')}
                                    <div className="flex items-center gap-2">
                                        {selectedGenre && (
                                            <span 
                                                className="w-2 h-2 rounded-full bg-blue-500"
                                            ></span>
                                        )}
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor" 
                                            className={`
                                                h-5 w-5 transition-transform duration-300 text-gray-400 dark:text-gray-300
                                                ${isMobileGenreOpen ? 'rotate-180' : ''}
                                            `}
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M19 9l-7 7-7-7" 
                                            />
                                        </svg>
                                    </div>
                                </button>
                                
                                {isMobileGenreOpen && (
                                    <div 
                                        className="px-3 pb-3 grid grid-cols-2 gap-2 max-h-60 overflow-y-auto"
                                    >
                                        {genres.map(g => (
                                            <button 
                                                key={g.id} 
                                                onClick={() => handleGenreSelect(g)} 
                                                className={`
                                                    text-left px-3 py-2.5 rounded-xl text-base font-medium transition-colors
                                                    ${selectedGenre?.id === g.id 
                                                        ? 'bg-blue-500 text-white shadow-md' 
                                                        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 active:bg-gray-200 dark:active:bg-gray-700 border border-gray-200/50 dark:border-gray-800'
                                                    }
                                                `}
                                            >
                                                {g.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                                <button 
                                    onClick={() => setIsMobileYearOpen(!isMobileYearOpen)} 
                                    className="w-full flex justify-between items-center px-4 py-3 text-gray-800 dark:text-white font-bold text-lg focus:outline-none"
                                >
                                    {t('navbar.year')}
                                    <div className="flex items-center gap-2">
                                        {selectedYear && (
                                            <span 
                                                className="w-2 h-2 rounded-full bg-purple-500"
                                            ></span>
                                        )}
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor" 
                                            className={`
                                                h-5 w-5 transition-transform duration-300 text-gray-400 dark:text-gray-300
                                                ${isMobileYearOpen ? 'rotate-180' : ''}
                                            `}
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M19 9l-7 7-7-7" 
                                            />
                                        </svg>
                                    </div>
                                </button>
                                
                                {isMobileYearOpen && (
                                    <div 
                                        className="px-3 pb-3 grid grid-cols-3 gap-2 max-h-60 overflow-y-auto"
                                    >
                                        {years.map(y => (
                                            <button 
                                                key={y} 
                                                onClick={() => handleYearSelect(y)} 
                                                className={`
                                                    text-center px-2 py-2.5 rounded-xl text-base font-medium transition-colors
                                                    ${selectedYear === y 
                                                        ? 'bg-purple-500 text-white shadow-md' 
                                                        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 active:bg-gray-200 dark:active:bg-gray-700 border border-gray-200/50 dark:border-gray-800'
                                                    }
                                                `}
                                            >
                                                {y}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                                <button 
                                    onClick={() => setIsMobileCountryOpen(!isMobileCountryOpen)} 
                                    className="w-full flex justify-between items-center px-4 py-3 text-gray-800 dark:text-white font-bold text-lg focus:outline-none"
                                >
                                    {t('navbar.country')}
                                    <div className="flex items-center gap-2">
                                        {selectedCountry && (
                                            <span 
                                                className="w-2 h-2 rounded-full bg-emerald-500"
                                            ></span>
                                        )}
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor" 
                                            className={`
                                                h-5 w-5 transition-transform duration-300 text-gray-400 dark:text-gray-300
                                                ${isMobileCountryOpen ? 'rotate-180' : ''}
                                            `}
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M19 9l-7 7-7-7" 
                                            />
                                        </svg>
                                    </div>
                                </button>
                                
                                {isMobileCountryOpen && (
                                    <div 
                                        className="px-3 pb-3 grid grid-cols-2 gap-2 max-h-60 overflow-y-auto"
                                    >
                                        {countries.map(c => (
                                            <button 
                                                key={c.iso_3166_1} 
                                                onClick={() => handleCountrySelect(c)} 
                                                className={`
                                                    text-left px-3 py-2.5 rounded-xl text-base font-medium transition-colors truncate
                                                    ${selectedCountry?.iso_3166_1 === c.iso_3166_1 
                                                        ? 'bg-emerald-500 text-white shadow-md' 
                                                        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 active:bg-gray-200 dark:active:bg-gray-700 border border-gray-200/50 dark:border-gray-800'
                                                    }
                                                `}
                                            >
                                                {c.english_name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {(selectedGenre || selectedYear || selectedCountry) && (
                                <button 
                                    onClick={clearFiltersAndNotify}
                                    className="w-full mt-2 py-3 rounded-xl text-red-500 dark:text-red-400 bg-red-50 dark:bg-gray-800 border dark:border-gray-700 font-bold text-base"
                                >
                                    {t('navbar.clear_filters')}
                                </button>
                            )}
                        </div>

                        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800 grid grid-cols-3 gap-4">
                            <button 
                                onClick={toggleLanguage} 
                                className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors gap-2"
                            >
                                <span className="text-2xl">
                                    {i18n.language === 'id' ? '🇮🇩' : '🇺🇸'}
                                </span>
                                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                                    {i18n.language === 'id' ? 'IND' : 'ENG'}
                                </span>
                            </button>
                            
                            <button 
                                onClick={() => { 
                                    navigate('/ai-chat'); 
                                    setIsMenuOpen(false); 
                                }} 
                                className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-2xl shadow-lg shadow-blue-500/30 transition-transform active:scale-95 gap-2"
                            >
                                <FaRobot className="w-6 h-6 text-white" />
                                <span className="text-sm font-bold text-white">
                                    AI
                                </span>
                            </button>
                            
                            <button 
                                onClick={toggleTheme} 
                                className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors gap-2"
                            >
                                {theme === 'dark' 
                                    ? <IoMdSunny className="w-6 h-6 text-yellow-500" /> 
                                    : <IoMdMoon className="w-6 h-6 text-gray-700" />
                                }
                                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                                    {theme === 'dark' ? 'Light' : 'Dark'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}