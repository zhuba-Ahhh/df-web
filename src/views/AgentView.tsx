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

  const filterAgentsByType = useCallback(
    (agents: AgentType[]) => {
      if (type === 'all') return agents;
      const currentTypeName = agentsNameMap.find((agentsName) => agentsName.key === type)?.label;
      return agents.filter((item) => item.armyType === currentTypeName);
    },
    [type]
  );

  const getAgents = useCallback(async () => {
    const res = await http.get<AgentType[]>('/agent/getAgents');
    const filteredAgents = filterAgentsByType(res);
    setAgents(filteredAgents);
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

  if (!currentAgent) return null;

  return (
    <div className={`h-[1000px] relative`}>
      <img
        className="object-fill absolute w-[100%]"
        src={currentAgent.pic}
        alt={currentAgent.operator}
      />
      <Swiper
        className={`w-8/12 absolute bottom-4`}
        spaceBetween={50}
        slidesPerView={5}
        navigation={{
          // nextEl: '.swiper-button-next',
          // prevEl: '.swiper-button-prev',
          enabled: true,
        }}
        modules={[Navigation, Scrollbar, A11y]}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {agents.map((agent) => {
          const isCurrentAgent = currentAgent.id === agent.id;
          return (
            <SwiperSlide key={agent.id}>
              <div
                onClick={() => setCurrentAgent(agent)}
                className={`cursor-pointer relative w-36 rounded-sm border hover:border-[#f4cf67] ${isCurrentAgent ? 'border-[#f4cf67]' : 'opacity-60'}`}
              >
                <img className="w-36" src={agent.pic} alt={agent.operator} />
                <p className="absolute bottom-1 left-1 text-white font-extralight text-sm">
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
