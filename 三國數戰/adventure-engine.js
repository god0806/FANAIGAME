/* Ordered, persistent side stories. write(state, reward) commits both together. */
window.createAdventureEngine = function ({data, read, write}) {
  const copy = value => JSON.parse(JSON.stringify(value));
  const stageQuests = stage => Number.isInteger(stage) && stage >= 0 && stage < data.chapters.length
    ? (Array.isArray(data.chapters[stage]) ? data.chapters[stage] : data.chapters[stage].quests || []) : [];
  const quest = (stage, id) => stageQuests(stage).find(item => item.id === id);
  const key = (stage, id) => stage + ':' + id;
  const empty = () => ({accepted:false, index:0, complete:false, choices:[]});
  const prize = input => Object.fromEntries(['coins','mp','heal'].map(name => [name,
    Number.isFinite(input?.[name]) ? Math.max(0, Math.min(100, Math.trunc(input[name]))) : 0]));
  let state = {version:1, quests:{}, events:{}};
  let stored;
  try { stored = read?.(); } catch { stored = null; }
  for (let stage = 0; stage < data.chapters.length; stage++) {
    for (const item of stageQuests(stage)) {
      const old = stored?.quests?.[key(stage,item.id)];
      if (!old || old.accepted !== true) continue;
      const index = Number.isInteger(old.index) ? Math.max(0, Math.min(item.steps.length,old.index)) : 0;
      state.quests[key(stage,item.id)] = {accepted:true, index,
        complete:index === item.steps.length, choices:Array.isArray(old.choices) ? old.choices.filter(choice =>
          choice && Number.isInteger(choice.step) && choice.step >= 0 && choice.step < index &&
          Number.isInteger(choice.option) && item.steps[choice.step]?.type === 'choice' &&
          choice.option >= 0 && choice.option < item.steps[choice.step].options.length
        ).map(choice => ({step:choice.step,option:choice.option})) : []};
    }
    const used = new Set();
    state.events[stage] = Array.isArray(stored?.events?.[stage]) ? stored.events[stage].filter(entry => {
      const item = data.events.find(item => item.id === entry?.id);
      if (!item || used.has(item.id) || !Number.isInteger(entry.option) || entry.option < 0 || entry.option >= item.outcomes.length) return false;
      used.add(item.id); return true;
    }).slice(0,3).map(entry => ({id:entry.id,option:entry.option})) : [];
  }
  const commit = (next, reward) => {
    const previous = state;
    state = next;
    try { write(copy(next), reward ? {...reward} : undefined); }
    catch (error) { state = previous; throw error; }
  };
  const progress = (stage,id) => copy(state.quests[key(stage,id)] || empty());
  function accept(stage,id) {
    const item = quest(stage,id);
    if (!item) return {ok:false,text:'這項委託不存在。'};
    if (progress(stage,id).accepted) return {ok:false,text:'這項委託已在手札中。'};
    const next = copy(state);
    next.quests[key(stage,id)] = {...empty(),accepted:true};
    commit(next);
    return {ok:true,text:'已接受「'+item.title+'」。'};
  }
  function advance(stage,id,target,answerIndex) {
    const item = quest(stage,id), current = progress(stage,id);
    if (!item || !current.accepted || current.complete) return {ok:false,text:'請先接受尚未完成的委託。'};
    const step = item.steps[current.index];
    if (target !== step.target) return {ok:false,text:'請先前往目前的任務地點。'};
    let text = step.text || '已完成這一步。';
    if (step.type === 'quiz' || step.type === 'choice') {
      if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= step.options.length)
        return {ok:false,text:'請選擇一個有效的選項。'};
      if (step.type === 'quiz') {
        if (answerIndex !== step.answer) return {ok:false,text:'再想一想。'+step.explain};
        text = '答對了！'+step.explain;
      } else {
        text = step.outcomes[answerIndex];
        current.choices.push({step:current.index,option:answerIndex});
      }
    } else if (step.type !== 'talk') return {ok:false,text:'這一步暫時無法進行。'};
    current.index++;
    current.complete = current.index === item.steps.length;
    const next = copy(state);
    next.quests[key(stage,id)] = current;
    const reward = current.complete ? prize(item.reward) : undefined;
    commit(next,reward);
    return {ok:true,complete:current.complete,text,...(reward ? {reward} : {})};
  }
  function event(stage) {
    if (!stageQuests(stage).length) return null;
    const used = state.events[stage] || [];
    if (used.length >= 3 || !data.events.length) return null;
    const start = (stage * 3 + used.length) % data.events.length;
    for (let offset=0; offset<data.events.length; offset++) {
      const item = data.events[(start+offset)%data.events.length];
      if (!used.some(entry => entry.id === item.id)) return copy(item);
    }
    return null;
  }
  function resolveEvent(stage,id,option) {
    const current = event(stage);
    if (!current || current.id !== id) return {ok:false,text:'這段奇遇已結束，請查看下一段旅程。'};
    if (!Number.isInteger(option) || option < 0 || option >= current.outcomes.length)
      return {ok:false,text:'請選擇一個有效的選項。'};
    const outcome = current.outcomes[option], next = copy(state), reward = prize(outcome.reward);
    next.events[stage].push({id,option});
    commit(next,reward);
    return {ok:true,text:outcome.text,reward};
  }
  function history(stage) {
    return (state.events[stage] || []).map(entry => {
      const item = data.events.find(item => item.id === entry.id);
      return {title:item.title,choice:item.options[entry.option],text:item.outcomes[entry.option].text};
    });
  }
  function summary(stage) {
    const entries = stageQuests(stage).map(item => progress(stage,item.id));
    return {total:entries.length,accepted:entries.filter(item => item.accepted).length,
      complete:entries.filter(item => item.complete).length,eventCount:(state.events[stage] || []).length,eventLimit:3};
  }
  return {accept,progress,advance,summary,event,resolveEvent,history,
    list:stage => stageQuests(stage).map(item => ({...copy(item),progress:progress(stage,item.id)}))};
};
