import React from 'react';
import { AlertCircle, RefreshCw, KeyRound, Clock, WifiOff } from 'lucide-react';


export default function ErrorMessage({
  error,
  errorCode,
  onRetry,
  isRetrying = false
}) {
  const isMissingKey = errorCode === 'ERR_MISSING_API_KEY';
  const isRateLimit = errorCode === 'ERR_RATE_LIMIT';
  const isTimeoutOrOffline = errorCode === 'ERR_TIMEOUT' || errorCode === 'ERR_OFFLINE';

  return (
    <div className="my-8 max-w-3xl mx-auto rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30 p-6 sm:p-8 shadow-sm">
      <div className="flex items-start space-x-4">
        <div className="shrink-0 p-3 rounded-full bg-red-100 dark:bg-red-900/50 text-editorial-red dark:text-red-400">
          {isMissingKey ? (
            <KeyRound className="w-6 h-6" />
          ) : isRateLimit ? (
            <Clock className="w-6 h-6" />
          ) : isTimeoutOrOffline ? (
            <WifiOff className="w-6 h-6" />
          ) : (
            <AlertCircle className="w-6 h-6" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-serif text-lg font-bold text-red-900 dark:text-red-200 mb-1">
            {isMissingKey
              ? 'NewsData.io API Key Required'
              : isRateLimit
              ? 'API Rate Limit Reached'
              : isTimeoutOrOffline
              ? 'Network Connection Issue'
              : 'Unable to Retrieve Latest Dispatches'}
          </h3>

          <p className="text-sm text-red-800 dark:text-red-300 mb-4 leading-relaxed">
            {error || 'An unexpected error occurred while communicating with the news service.'}
          </p>

          {/* Actionable guidance box */}
          {isMissingKey && (
            <div className="p-3.5 rounded bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/40 text-xs font-mono text-stone-700 dark:text-zinc-300 mb-4">
              <p className="font-bold text-ink-900 dark:text-white mb-1 font-sans">
                Quick Setup Steps:
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Register for a free key at <a href="https://newsdata.io/register" target="_blank" rel="noreferrer" className="underline text-editorial-red">newsdata.io/register</a></li>
                <li>Add it to your local <span className="bg-stone-100 dark:bg-zinc-800 px-1 py-0.5 rounded">.env</span> file:</li>
                <li className="font-bold text-editorial-red select-all">VITE_NEWSDATA_API_KEY=pub_your_key_here</li>
                <li>Restart Vite with <span className="bg-stone-100 dark:bg-zinc-800 px-1 py-0.5 rounded">npm run dev</span></li>
              </ol>
            </div>
          )}

          {isRateLimit && (
            <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 mb-4">
              <p className="font-medium">
                NewsData.io free tier grants 200 API credits/day and max 30 calls every 15 minutes. Wait a few moments or consider upgrading your tier.
              </p>
            </div>
          )}

          {/* Retry Action */}
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-editorial-red hover:bg-red-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Retrying Connection...' : 'Retry Fetch'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
