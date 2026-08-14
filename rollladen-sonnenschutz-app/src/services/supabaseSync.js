function withTimeout(promise, timeoutMs) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Cloud-Anfrage hat zu lange gedauert.")), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

export async function saveCompanySnapshot({
  client,
  companyRow,
  peopleRows,
  orderRows,
  deletedOrderIds = [],
  snapshotRow,
  timeoutMs = 15000,
}) {
  if (!client) throw new Error("Supabase ist nicht konfiguriert.");

  return withTimeout((async () => {
    const { data: authData, error: authError } = await client.auth.getUser();
    if (authError) throw authError;
    if (!authData?.user) throw new Error("Keine gültige Cloud-Sitzung gefunden.");

    const { error: companyError } = await client.from("companies").upsert({ ...companyRow, owner_id: authData.user.id });
    if (companyError) throw companyError;

    if (peopleRows.length) {
      const { error: peopleError } = await client.from("company_people").upsert(peopleRows);
      if (peopleError) throw peopleError;
    }

    if (orderRows.length) {
      const { error: ordersError } = await client.from("orders").upsert(orderRows);
      if (ordersError) throw ordersError;
    }

    if (deletedOrderIds.length) {
      const { error: deleteError } = await client.from("orders").delete().eq("company_id", companyRow.id).in("id", deletedOrderIds);
      if (deleteError) throw deleteError;
    }

    const { error: snapshotError } = await client.from("app_snapshots").upsert({ ...snapshotRow, updated_by: authData.user.id });
    if (snapshotError) throw snapshotError;

    return { user: authData.user };
  })(), timeoutMs);
}

export async function saveLearningRecord({ client, learningRow, timeoutMs = 15000 }) {
  if (!client) throw new Error("Supabase ist nicht konfiguriert.");
  return withTimeout((async () => {
    const { data: authData, error: authError } = await client.auth.getUser();
    if (authError) throw authError;
    if (!authData?.user) throw new Error("Keine gültige Cloud-Sitzung gefunden.");
    const { error } = await client.from("learning_records").upsert({ ...learningRow, updated_by: authData.user.id });
    if (error) throw error;
    return { user: authData.user };
  })(), timeoutMs);
}

export async function loadLearningRecord({ client, companyId, personId, timeoutMs = 15000 }) {
  if (!client || !companyId || !personId) return null;
  return withTimeout((async () => {
    const { data, error } = await client.from("learning_records").select("data, updated_at").eq("company_id", companyId).eq("person_id", personId).maybeSingle();
    if (error) throw error;
    return data || null;
  })(), timeoutMs);
}
