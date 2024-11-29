import { useEffect, useState, useCallback } from 'react';
import { AgentType } from 'types';
import { http } from 'utils/request';
import { Navigation, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { useParams } from 'react-router-dom';
import { agentsNameMap } from 'common/const';

const AgentView = () => {
  const { type = 'all' } = useParams();
  const [agents, setAgents] = useState<AgentType[]>([]);
  const [currentAgent, setCurrentAgent] = useState<AgentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterAgentsByType = useCallback(
    (agents: AgentType[]) => {
      if (type === 'all') return agents;
      const currentTypeName = agentsNameMap.find((agentsName) => agentsName.key === type)?.label;
      return agents.filter((item) => item.armyType === currentTypeName);
    },
    [type]
  );

  const getAgents = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await http.get<AgentType[]>('/agent/getAgents');
      const filteredAgents = filterAgentsByType(res);
      setAgents(filteredAgents);
      setError(null);
    } catch (err) {
      setError('获取特工数据失败');
    } finally {
      setIsLoading(false);
    }
  }, [filterAgentsByType]);

  useEffect(() => {
    setCurrentAgent(agents[0]);
  }, [agents]);

  useEffect(() => {
    getAgents();
  }, [getAgents]);

  useEffect(() => {
    setAgents((prev) => filterAgentsByType(prev));
  }, [type, filterAgentsByType]);

  const handleSlideChange = (swiper: SwiperType) => {
    const activeIndex = swiper.realIndex;
    setCurrentAgent(agents[activeIndex]);
  };

  if (isLoading)
    return <div className="h-[1000px] flex items-center justify-center">加载中...</div>;
  if (error)
    return <div className="h-[1000px] flex items-center justify-center text-red-500">{error}</div>;
  if (!currentAgent) return null;

  return (
    <div className="h-full relative">
      {currentAgent && (
        <div className="absolute left-4 bottom-4 z-10 bg-black/50 p-4 rounded-lg text-white w-80">
          <h2 className="text-2xl font-bold mb-2">{currentAgent.operator}</h2>
          <p className="text-sm text-gray-300 mb-4">{currentAgent.fullName}</p>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <img src={currentAgent.armyTypePic} alt={currentAgent.armyType} className="w-6 h-6" />
              <span>{currentAgent.armyType}</span>
            </div>
            <p className="text-sm text-gray-300">{currentAgent.armyTypeDesc}</p>
          </div>

          <div className="space-y-4">
            {currentAgent.abilitiesList.map((ability) => (
              <div key={ability.abilityName} className="flex gap-3">
                <img src={ability.abilityPic} alt={ability.abilityName} className="w-12 h-12" />
                <div>
                  <h3 className="font-medium">{ability.abilityName}</h3>
                  <p className="text-sm text-gray-300">{ability.abilityDesc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <img
        className="object-contain absolute w-full h-full"
        src={currentAgent.pic}
        alt={currentAgent.operator}
        loading="eager"
      />
      <Swiper
        className="w-8/12 absolute bottom-[-8px] custom-swiper-navigation"
        spaceBetween={30}
        slidesPerView={5}
        navigation={true}
        modules={[Navigation, Scrollbar, A11y]}
        loop={true}
        grabCursor={true}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        onSlideChange={handleSlideChange}
      >
        {agents.map((agent) => {
          const isCurrentAgent = currentAgent.id === agent.id;
          return (
            <SwiperSlide key={agent.id}>
              <div
                onClick={() => setCurrentAgent(agent)}
                className={`cursor-pointer relative w-36 rounded-sm border transition-all duration-300 m-2
                  ${isCurrentAgent ? 'border-[#f4cf67] scale-105' : 'border-transparent opacity-60 hover:opacity-90'}`}
              >
                <img
                  className="w-36"
                  src={agent.prePic || agent.pic}
                  alt={agent.operator}
                  loading="lazy"
                />
                <p className="absolute bottom-1 left-1 text-white font-extralight text-sm drop-shadow-lg">
                  {agent.operator}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export { AgentView };
