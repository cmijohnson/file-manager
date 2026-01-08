import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './AIAssistant.css';

export default function AIAssistant({ apiSettings }) {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [provider, setProvider] = useState(apiSettings?.defaultProvider || 'gemini');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        // Check for API key
        const apiKey = provider === 'gemini' ? apiSettings?.geminiKey : apiSettings?.deepseekKey;
        if (!apiKey) {
            setMessages(prev => [...prev, {
                role: 'system',
                content: t('ai.noApiKey'),
                timestamp: Date.now()
            }]);
            return;
        }

        const userMessage = {
            role: 'user',
            content: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await window.electron?.sendAIMessage?.({
                provider,
                apiKey,
                message: input,
                history: messages
            });

            if (response?.error) {
                setMessages(prev => [...prev, {
                    role: 'system',
                    content: `${t('ai.error')}: ${response.error}`,
                    timestamp: Date.now()
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.content,
                    timestamp: Date.now()
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'system',
                content: `${t('ai.error')}: ${error.message}`,
                timestamp: Date.now()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setMessages([]);
    };

    return (
        <div className="ai-assistant">
            <div className="ai-header">
                <div className="ai-provider-selector">
                    <select value={provider} onChange={(e) => setProvider(e.target.value)}>
                        <option value="gemini">Gemini</option>
                        <option value="deepseek">DeepSeek</option>
                    </select>
                </div>
                <button className="ai-clear-btn" onClick={handleClear}>
                    {t('ai.clearHistory')}
                </button>
            </div>

            <div className="ai-messages">
                {messages.length === 0 && (
                    <div className="ai-empty-state">
                        <Sparkles size={48} />
                        <p>{t('ai.welcome')}</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`ai-message ai-message-${msg.role}`}>
                        <div className="ai-message-icon">
                            {msg.role === 'user' ? '👤' : msg.role === 'assistant' ? <Bot size={20} /> : 'ℹ️'}
                        </div>
                        <div className="ai-message-content">
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="ai-message ai-message-assistant">
                        <div className="ai-message-icon"><Bot size={20} /></div>
                        <div className="ai-message-content ai-thinking">
                            {t('ai.thinking')}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="ai-input-container">
                <input
                    type="text"
                    className="ai-input"
                    placeholder={t('ai.placeholder')}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                />
                <button
                    className="ai-send-btn"
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
