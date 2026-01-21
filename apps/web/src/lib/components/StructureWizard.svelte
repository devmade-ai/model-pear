<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {
    DECISION_FACTORS,
    QUESTION_ORDER,
    VARIANT_FACTORS,
    MODEL_METADATA,
    getModelRecommendations,
    getVariantRecommendation,
    generateRationale,
    type ModelId,
    type ModelRecommendation,
  } from '$lib/config/wizard';

  const dispatch = createEventDispatcher<{
    select: { modelId: ModelId; variantId?: string };
    skip: void;
  }>();

  // Wizard state
  let answers: Record<string, string> = {};
  let isComplete = false;
  let selectedVariantPreference: string = '';
  let currentQuestionIndex = 0;

  // Derived state
  $: answeredCount = Object.keys(answers).length;
  $: totalQuestions = QUESTION_ORDER.length;
  $: progress = Math.round((answeredCount / totalQuestions) * 100);
  $: allAnswered = answeredCount === totalQuestions;
  $: recommendations = answeredCount > 0 ? getModelRecommendations(answers) : [];
  $: topRecommendation = recommendations[0];

  // Current question
  $: currentFactorId = QUESTION_ORDER[currentQuestionIndex];
  $: currentQuestion = DECISION_FACTORS[currentFactorId];
  $: currentAnswer = answers[currentFactorId];
  $: canGoBack = currentQuestionIndex > 0;
  $: canGoNext = currentAnswer !== undefined;
  $: isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  function handleAnswer(factorId: string, value: string) {
    answers = { ...answers, [factorId]: value };
  }

  function handleBack() {
    if (canGoBack) {
      currentQuestionIndex--;
    }
  }

  function handleNext() {
    if (canGoNext && !isLastQuestion) {
      currentQuestionIndex++;
    }
  }

  function goToQuestion(index: number) {
    // Only allow jumping to answered questions or the first unanswered
    const firstUnansweredIndex = QUESTION_ORDER.findIndex((id) => answers[id] === undefined);
    const maxAllowedIndex = firstUnansweredIndex === -1 ? totalQuestions - 1 : firstUnansweredIndex;

    if (index <= maxAllowedIndex) {
      currentQuestionIndex = index;
    }
  }

  function handleSeeResults() {
    isComplete = true;
  }

  function handleRestart() {
    answers = {};
    isComplete = false;
    selectedVariantPreference = '';
    currentQuestionIndex = 0;
  }

  function handleSkip() {
    dispatch('skip');
  }

  function handleUseModel(modelId: ModelId) {
    let variantId: string | undefined;

    if (selectedVariantPreference) {
      const variantRec = getVariantRecommendation(modelId, selectedVariantPreference);
      if (variantRec && variantRec.variants.length > 0) {
        variantId = variantRec.variants[0];
      }
    }

    dispatch('select', { modelId, variantId });
  }

  function getMatchColorClass(color: string) {
    const colorMap: Record<string, string> = {
      green: 'text-green-500 bg-green-50 border-green-200',
      blue: 'text-blue-500 bg-blue-50 border-blue-200',
      yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      red: 'text-red-500 bg-red-50 border-red-200',
    };
    return colorMap[color] || colorMap.blue;
  }
</script>

<div class="structure-wizard">
  <!-- Header -->
  <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Structure Selection Wizard</h2>
      <p class="text-sm text-gray-500 mt-1">
        {isComplete ? 'Review your recommended transaction structures' : 'Answer questions to find the optimal transaction model'}
      </p>
    </div>
    <div class="flex gap-3">
      {#if !isComplete}
        <button class="text-sm text-gray-500 hover:text-gray-700 underline" on:click={handleSkip}>
          Skip wizard
        </button>
      {/if}
      {#if answeredCount > 0}
        <button class="text-sm text-blue-600 hover:text-blue-800 underline" on:click={handleRestart}>
          Start over
        </button>
      {/if}
    </div>
  </div>

  {#if isComplete && topRecommendation}
    <!-- RESULTS VIEW -->
    <div class="space-y-6">
      <!-- Top Recommendation -->
      <div class="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">{topRecommendation.icon}</span>
          <div>
            <h3 class="text-xl font-semibold text-green-700">Recommended: {topRecommendation.name}</h3>
            <p class="text-sm text-green-600">
              {topRecommendation.matchLevel.label} ({topRecommendation.normalizedScore}% match)
            </p>
          </div>
        </div>
        <p class="text-gray-700 mb-4">{topRecommendation.description}</p>

        <!-- Rationale -->
        <div class="bg-white/60 rounded-lg p-4 mb-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Why this model?</h4>
          <div class="text-sm text-gray-600 whitespace-pre-line">{generateRationale(topRecommendation)}</div>
        </div>

        <!-- Variant Selector -->
        {#if VARIANT_FACTORS[topRecommendation.modelId]}
          <div class="border-t border-gray-200 pt-4 mt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">
              {VARIANT_FACTORS[topRecommendation.modelId].question}
            </h4>
            <select
              bind:value={selectedVariantPreference}
              class="input w-full"
            >
              <option value="">Select a variant preference...</option>
              {#each VARIANT_FACTORS[topRecommendation.modelId].factors as factor}
                <option value={factor.value}>{factor.label}</option>
              {/each}
            </select>

            {#if selectedVariantPreference}
              {@const variantRec = getVariantRecommendation(topRecommendation.modelId, selectedVariantPreference)}
              {#if variantRec}
                <div class="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p class="text-sm text-blue-700">
                    <span class="font-medium">Recommended variant:</span>
                    {variantRec.variants.join(', ')}
                  </p>
                  <p class="text-xs text-gray-600 mt-1">
                    <span class="text-gray-700">Best for:</span>
                    {variantRec.scenario}
                  </p>
                </div>
              {/if}
            {/if}
          </div>
        {/if}

        <button
          class="btn-primary w-full mt-4"
          on:click={() => handleUseModel(topRecommendation.modelId)}
        >
          Use {topRecommendation.shortName} →
        </button>
      </div>

      <!-- Alternative Options -->
      <div>
        <h4 class="text-lg font-medium text-gray-900 mb-4">Alternative Options</h4>
        <div class="space-y-3">
          {#each recommendations.slice(1) as rec}
            <div class="card p-4 hover:border-gray-300 transition-colors">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-xl">{rec.icon}</span>
                  <span class="{getMatchColorClass(rec.matchLevel.color)} px-2 py-0.5 rounded text-xs font-medium">
                    {rec.matchLevel.icon}
                  </span>
                  <h5 class="font-medium text-gray-900">{rec.shortName}</h5>
                </div>
                <span class="text-sm text-gray-500">{rec.normalizedScore}%</span>
              </div>
              <p class="text-sm text-gray-600 mb-3">{rec.description}</p>

              {#if rec.strengths.length > 0}
                <p class="text-xs text-gray-500 mb-3">
                  <span class="text-green-500">✓</span>
                  {rec.strengths.slice(0, 2).map((s) => s.reason).join(', ')}
                </p>
              {/if}

              <button
                class="text-sm text-blue-600 hover:text-blue-800"
                on:click={() => handleUseModel(rec.modelId)}
              >
                Use this model →
              </button>
            </div>
          {/each}
        </div>
      </div>

      <!-- Answer Summary -->
      <div class="card p-4 bg-gray-50">
        <h4 class="text-sm font-medium text-gray-700 mb-3">Your Answers</h4>
        <div class="space-y-2">
          {#each QUESTION_ORDER as factorId}
            {@const factor = DECISION_FACTORS[factorId]}
            {@const answer = answers[factorId]}
            {@const option = factor.options.find((o) => o.value === answer)}
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">{factor.question}</span>
              <span class="text-gray-900">{option?.label || 'Not answered'}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {:else}
    <!-- QUESTIONS VIEW -->
    <div class="space-y-6">
      <!-- Progress Indicator -->
      <div>
        <!-- Question Step Indicators -->
        <div class="flex items-center justify-center gap-2 mb-4">
          {#each QUESTION_ORDER as factorId, idx}
            {@const isAnswered = answers[factorId] !== undefined}
            {@const isCurrent = idx === currentQuestionIndex}
            {@const isAccessible = idx <= (QUESTION_ORDER.findIndex((id) => answers[id] === undefined) === -1 ? totalQuestions - 1 : QUESTION_ORDER.findIndex((id) => answers[id] === undefined))}
            <button
              class="w-8 h-8 rounded-full text-xs font-medium transition-all
                     {isCurrent
                ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                : isAnswered
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : isAccessible
                    ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-300 cursor-not-allowed'}"
              on:click={() => goToQuestion(idx)}
              disabled={!isAccessible}
              title="Question {idx + 1}{isAnswered ? ' (answered)' : ''}"
            >
              {#if isAnswered && !isCurrent}
                ✓
              {:else}
                {idx + 1}
              {/if}
            </button>
          {/each}
        </div>
        <!-- Progress Bar -->
        <div class="flex justify-between text-xs text-gray-500 mb-2">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{answeredCount} answered</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-blue-500 transition-all duration-300" style="width: {((currentQuestionIndex + 1) / totalQuestions) * 100}%"></div>
        </div>
      </div>

      <!-- Current Question -->
      <div class="card p-6 border-2 border-blue-200 bg-blue-50/30">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs text-blue-600 font-medium">Question {currentQuestionIndex + 1}</span>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{currentQuestion.question}</h3>
        <p class="text-sm text-gray-500 mb-4">{currentQuestion.description}</p>

        <div class="space-y-3">
          {#each currentQuestion.options as option}
            <label
              class="flex items-start gap-3 p-4 bg-white rounded-lg border-2 cursor-pointer transition-all
                     {currentAnswer === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'}"
            >
              <input
                type="radio"
                name="question-{currentFactorId}"
                value={option.value}
                checked={currentAnswer === option.value}
                on:change={() => handleAnswer(currentFactorId, option.value)}
                class="mt-1 w-4 h-4 text-blue-600"
              />
              <div class="flex-1">
                <span class="font-medium text-gray-900">{option.label}</span>
                <p class="text-sm text-gray-500 mt-1">{option.description}</p>
              </div>
            </label>
          {/each}
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex items-center justify-between pt-4">
        <button
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors
                 {canGoBack
            ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            : 'text-gray-300 bg-gray-50 cursor-not-allowed'}"
          on:click={handleBack}
          disabled={!canGoBack}
        >
          ← Back
        </button>

        <div class="flex gap-3">
          {#if isLastQuestion && canGoNext}
            <button
              class="btn-primary px-6 py-2"
              on:click={handleSeeResults}
            >
              See Recommendations →
            </button>
          {:else}
            <button
              class="px-6 py-2 text-sm font-medium rounded-lg transition-colors
                     {canGoNext
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}"
              on:click={handleNext}
              disabled={!canGoNext}
            >
              Next →
            </button>
          {/if}
        </div>
      </div>

      <!-- Live Preview -->
      {#if answeredCount > 0}
        <div class="pt-6 border-t border-gray-200">
          <h4 class="text-sm font-medium text-gray-500 mb-3">Current Top Recommendations</h4>
          <div class="flex gap-2 flex-wrap">
            {#each recommendations.slice(0, 3) as rec}
              <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                <span class="text-lg">{rec.icon}</span>
                <span class="text-gray-700">{rec.shortName}</span>
                <span class="text-gray-400">{rec.normalizedScore}%</span>
              </span>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
