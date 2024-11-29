import { useEffect, useState, useCallback } from 'react';
import { AgentType } from 'types';
import { http } from 'utils/request';
import { Navigation, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
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

  if (isLoading)
    return <div className="h-[1000px] flex items-center justify-center">加载中...</div>;
  if (error)
    return <div className="h-[1000px] flex items-center justify-center text-red-500">{error}</div>;
  if (!currentAgent) return null;

  return (
    <div className="h-full relative">
      <img
        className="object-contain absolute w-full h-full"
        src={currentAgent.pic}
        alt={currentAgent.operator}
        loading="eager"
      />
      <Swiper
        className="w-8/12 absolute bottom-4"
        spaceBetween={30}
        slidesPerView={5}
        navigation={true}
        modules={[Navigation, Scrollbar, A11y]}
        loop={true}
        grabCursor={true}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
      >
        {agents.map((agent) => {
          const isCurrentAgent = currentAgent.id === agent.id;
          return (
            <SwiperSlide key={agent.id}>
              <div
                onClick={() => setCurrentAgent(agent)}
                className={`cursor-pointer relative w-36 rounded-sm border transition-all duration-300
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
