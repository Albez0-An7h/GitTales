import React from 'react';
import Footer from './Footer';
import { useParams } from 'react-router-dom';
import GitHubHeatmap from './GithubHeatMap';
import { Link } from 'react-router-dom';


const PersonData = () => {
    const params = useParams()
    const userName = params.username

    const token = import.meta.env.VITE_GITHUB_API_TOKEN;
    const [result, setResult] = React.useState();
    React.useEffect(() => {
        fetch(`https://api.github.com/users/${userName}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        }).then(res => res.json()).then(json => setResult(json));
    }, [userName,token]);

    const [prresult, setPrresult] = React.useState();
    React.useEffect(() => {
        fetch(`https://api.github.com/search/issues?q=author:${userName}+type:pr&`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        }).then(res => res.json()).then(json => setPrresult(json));
    }, [userName,token]);

    return (
        <>

            <div className='w-full h-auto'>
                <Link to={'/'}>
                    <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg absolute top-5 left-10 cursor-pointer">
                        Go to Home Page
                    </button>
                </Link>
                <h1 className="text-3xl font-bold text-center text-amber-400 my-6">Gitales - The Story of your Github Journey</h1>

                <div className='flex flex-col items-center justify-center'>
                    <div className=' mt-10 h-80 w-150 bg-gray-100 rounded-2xl flex items-center justify-between z-0'>
                        <img src={result && result.avatar_url}
                            alt="avatar"
                            className='h-60 w-60 rounded-4xl left-7.5 relative' />

                        <div className='relative right-15'>
                            <h3 className='text-lg'>Name: {result && result.name}</h3>
                            <h3 className='text-lg'>User-Name: {result && result.login}</h3>
                            <h3 className='text-lg'>Public Repos: {result && result.public_repos}</h3>
                            <a href={result && result.html_url}><button className='h-10 w-25 bg-blue-400 rounded-2xl cursor-pointer mt-10'> <span className='text-white'>Visit Profile</span> </button></a>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-10 ml-5 flex items-center justify-center'>
                <img src={`https://github-readme-stats.vercel.app/api/top-langs?username=${userName}&locale=en&hide_title=false&layout=compact&card_width=320&langs_count=5&theme=light_border=false&order=2`} height="150" alt="languages graph" />
                <img src={`https://streak-stats.demolab.com?user=${userName}&locale=en&mode=daily&theme=light_border=false&border_radius=5&order=3`} height="150" alt="streak graph" className='ml-10' />
            </div>

            <div>
                <h2 className='mt-20 text-3xl text-amber-400 ml-10 font-bold mb-6'>Pull Requests by {userName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-10">
                    {prresult && prresult.items ?
                        prresult.items.map((pr) => (
                            <div key={pr.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-2 py-1 text-xs font-bold rounded ${pr.state === 'open' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                                            {pr.state.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-gray-500">{new Date(pr.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-medium text-lg mb-2 line-clamp-2 hover:text-blue-600">
                                        <a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            {pr.title}
                                        </a>
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-600 mt-4">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"></path>
                                            </svg>
                                            {pr.repository_url ? pr.repository_url.split('/').pop() : 'Repository'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )) :
                        <div className="col-span-full flex justify-center p-8">
                            <div className="bg-gray-100 rounded-lg p-6 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="mt-2 text-base text-gray-600">Loading pull requests...</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <GitHubHeatmap username={userName}/>
            <Footer />
        </>
    );

};

export default PersonData