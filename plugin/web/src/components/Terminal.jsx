import React, { useState, useEffect } from 'react';
import './Terminal.css';

const Typewriter = ({ text, delay = 30, onComplete }) => {
    const [currentText, setCurrentText] = useState('');

    useEffect(() => {
        if (!text) return;
        let i = 0;
        const timer = setInterval(() => {
            setCurrentText(text.slice(0, i + 1));
            i++;
            if (i > text.length) {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, delay);
        return () => clearInterval(timer);
    }, [text, delay, onComplete]);

    return <span>{currentText}</span>;
};

const CountUp = ({ end, duration = 1000, delay = 0 }) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const startTimer = setTimeout(() => {
            setHasStarted(true);
        }, delay);

        return () => clearTimeout(startTimer);
    }, [delay]);

    useEffect(() => {
        if (!hasStarted) return;

        const endValue = typeof end === 'string' ? parseInt(end.replace(/,/g, '')) : end;
        if (isNaN(endValue)) {
            setCount(end);
            return;
        }

        const startTime = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * endValue);

            setCount(current);

            if (progress >= 1) {
                clearInterval(timer);
                setCount(endValue);
            }
        }, 16);

        return () => clearInterval(timer);
    }, [end, duration, hasStarted]);

    if (!hasStarted) return <span>0</span>;

    const displayValue = typeof count === 'number' ? count.toLocaleString() : count;
    return <span>{displayValue}</span>;
};

const StatCard = ({ label, value, subtext, delay = 0 }) => {
    return (
        <div className="stat-card">
            <div className="stat-label">{label}</div>
            <div className="stat-value">
                {typeof value === 'string' && value.includes('days') ? (
                    value
                ) : typeof value === 'string' && value.includes('/') ? (
                    value
                ) : (
                    <CountUp end={value} duration={2000} delay={delay} />
                )}
            </div>
            {subtext && <div className="stat-sub">{subtext}</div>}
        </div>
    );
};

const Terminal = ({ data }) => {
    if (!data) return null;

    return (
        <div className="terminal-window">
            <div className="terminal-header">
                <div className="window-buttons">
                    <span className="btn red"></span>
                    <span className="btn yellow"></span>
                    <span className="btn green"></span>
                </div>
                <div className="window-title">claude_code_wrapped_2025</div>
            </div>

            <div className="terminal-content">
                <div className="command-line">
                    <span className="prompt">➜</span>
                    <span className="cmd"> ./wrapped.sh --year=2025</span>
                </div>

                <div className="section intro">
                    <div className="ascii-logo">
                        {`▐▛███▜▌
▝▜█████▛▘
▘▘ ▝▝`}
                    </div>
                    <div className="greeting">
                        <div>&gt; <Typewriter text="Noodling..." delay={50} /></div>
                    </div>
                </div>

                <div className="section grid-stats">
                    <StatCard label="🎯 Sessions" value={data.activity.totalSessions ? data.activity.totalSessions : 'N/A'} delay={2500} />
                    <StatCard label="🪙 Tokens" value={data.model.totalTokens} delay={3300} />
                    <StatCard label="💬 Messages" value={data.activity.totalMessages} delay={2600} />
                    <StatCard label="📅 Active Days" value={data.activity.daysActive} delay={2700} />
                    <StatCard label="🔥 Longest Streak" value={`${data.activity.longestStreak} days`} delay={2800} />
                    <StatCard label="⚡ Top Command" value={data.commands.topCommands[0] ? `/${data.commands.topCommands[0].command.replace('/', '')}` : 'N/A'} delay={2900} />
                    <StatCard label="📂 Most Active Project" value={data.commands.mostActiveProject ? data.commands.mostActiveProject.name : 'N/A'} delay={3000} />
                    <StatCard label="⭐ Most Active Day" value={data.activity.mostActiveDay ? data.activity.mostActiveDay.date : 'N/A'} delay={3100} />
                    <StatCard label="🛠️ Tool Calls" value={data.activity.totalToolCalls} delay={3200} />
                </div>

                <div className="section models">
                    <h3>&gt; MODEL_USAGE_ANALYSIS</h3>
                    <div className="model-bars">
                        {data.model.modelBreakdown && data.model.modelBreakdown.map((model, index) => {
                            return (
                                <div key={model.name} className="model-row">
                                    <div className="model-name">{model.name}</div>
                                    <div className="progress-track">
                                        <div className="progress-bar" style={{ width: `${model.percentage}%` }}></div>
                                    </div>
                                    <div className="model-count">{model.percentage}%</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="section footer">
                    <div className="achievement-box">
                        <div className="trophy">🏆</div>
                        <div>
                            <h4>Code Persona: {data.time.persona.name || "Cyber Nomad"}</h4>
                            <p>{data.time.persona.description || "You are a coding machine."}</p>
                        </div>
                    </div>
                    <div className="cursor-line">
                        <span className="prompt">➜</span> <span className="cursor">█</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Terminal;
